"use client"

import * as Accordion from '@radix-ui/react-accordion';
import { Box, Flex, Text, TextFieldInput, TextFieldRoot } from '@radix-ui/themes';
import classNames from 'classnames';
import React, { ReactElement, ReactNode, Ref, useEffect, useRef, useState } from 'react';
import { IoAddOutline, IoChevronForward, IoEllipsisHorizontal } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import OutsideClickAlerter from '../OutsideClickAlerter';
import Icon from './Icon';
import "./sidebar.css";

interface AccordionProps {
    children?: ReactNode;
    className?: string;
}

interface AccordionHeaderProps extends AccordionProps {
    triggerOpenClose: () => void;
    onAddClick?: () => void;
}

const AccordionHeader = React.forwardRef(({ children, className, triggerOpenClose, onAddClick, ...props }: AccordionHeaderProps, forwardedRef) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);

    return (
        <Accordion.Header
            className="AccordionHeader"
            aria-orientation="horizontal"
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
        >
            <Flex className="HeaderContent">
                <Box className="HoverBox Square">
                    <Accordion.Trigger
                        className={classNames('AccordionTrigger', className)}
                        {...props}
                        // ref={forwardedRef as Ref<HTMLButtonElement>}
                        onClick={triggerOpenClose}
                    >
                        <IoChevronForward className="AccordionChevron" aria-hidden />
                    </Accordion.Trigger>
                </Box>
                {children}
            </Flex>
            {showOptions && (
                <Flex className="HeaderContent">
                    <Box className="HoverBox Square">
                        <IoEllipsisHorizontal size={12} />
                    </Box>
                    <Box className="HoverBox Square">
                        <IoAddOutline size={12} onClick={onAddClick} />
                    </Box>
                </Flex>
            )}
        </Accordion.Header>
    )
});

const AccordionContent = React.forwardRef(({ children, className, ...props }: AccordionProps, forwardedRef) => (
    <Accordion.Content
        className={classNames('AccordionContent', className)}
        {...props}
        ref={forwardedRef as Ref<HTMLDivElement>}
    >
        {children || <Text className="AccordionContentText">No pages inside</Text>}
        {/* <div className="AccordionContentText">{children || "No pages inside"}</div> */}
    </Accordion.Content>
));

export interface ItemInfo {
    id: string;
    title: string | undefined;
    emoji: string | undefined;
    subItems?: ItemInfo[];
}

export interface MenuItemProps {
    appPortalId: string;
    parentsIdBreadCrumbs: string[];
    toggleItem: (id: string, forceOpen?: boolean) => void;
    upsertItem: (item: ItemInfo, idBreadCrumbs: string[]) => void;
    setOpenPageInfo?: (item: ItemInfo) => void;
    id?: string;
    text?: string;
    emoji?: string;
    children?: ReactElement<MenuItemProps> | Array<ReactElement<MenuItemProps>>;
}

export const MenuItem = ({
    appPortalId,
    parentsIdBreadCrumbs,
    toggleItem,
    upsertItem,
    setOpenPageInfo,
    id,
    text,
    emoji,
    children,
}: MenuItemProps) => {
    const [itemText, setItemText] = useState<string | undefined>(text);
    const [inputItemText, setInputItemText] = useState<string>("Untitled");
    const [emojiCode, _setEmojiCode] = useState<string | undefined>(emoji);

    const inputItemRef = useRef<string>(inputItemText);
    const emojiCodeRef = useRef<string | undefined>(emojiCode);

    useEffect(() => {
        inputItemRef.current = inputItemText
    }, [inputItemText])

    useEffect(() => {
        emojiCodeRef.current = emojiCode
    }, [emojiCode])

    // Sync props and states
    useEffect(() => {
        setItemText(text);
    }, [text])

    const menuItemId = id || uuidv4();

    const createSubMenuItem = () => {
        // Create new empty sub item
        upsertItem(
            { id: uuidv4(), title: undefined, emoji: undefined },
            [...parentsIdBreadCrumbs, menuItemId]
        );

        // Open current item
        toggleItem(menuItemId, true)
    }

    const tryFinishMenuItemCreation = () => {
        setItemText(inputItemRef.current);

        const item = { id: menuItemId, title: inputItemRef.current, emoji: emojiCodeRef.current };
        upsertItem(item, parentsIdBreadCrumbs);
        setOpenPageInfo?.(item);
    }

    const setEmojiCode = (newEmojiCode: string) => {
        _setEmojiCode(newEmojiCode);

        const item = { id: menuItemId, title: itemText, emoji: newEmojiCode };
        upsertItem(item, parentsIdBreadCrumbs);
    }

    return (
        <Accordion.Item key={menuItemId} value={menuItemId}>
            <AccordionHeader
                onAddClick={createSubMenuItem}
                triggerOpenClose={() => toggleItem(menuItemId)}
            >
                <Box className="HoverBox Square">
                    <Icon
                        emojiPickerPortalId={appPortalId}
                        emojiCode={emojiCode}
                        saveEmojiCode={setEmojiCode}
                        emptyPage={!itemText}
                    />
                </Box>
                {itemText ?
                    (<Text onClick={() => setOpenPageInfo?.({
                        id: menuItemId,
                        title: itemText,
                        emoji: emojiCode
                    })}>
                        {itemText}
                    </Text>) : (
                        <OutsideClickAlerter onOutsideClick={tryFinishMenuItemCreation}>
                            {/* Text root is necessary https://stackoverflow.com/a/77483532/7454638 */}
                            <TextFieldRoot className="PageNameInputRoot">
                                <TextFieldInput
                                    variant="soft"
                                    radius="none"
                                    placeholder={inputItemText}
                                    onKeyDown={(e) => { e.key === "Enter" && tryFinishMenuItemCreation() }}
                                    onInput={(e) => setInputItemText((e.target as HTMLInputElement).value)}
                                    autoFocus={true}
                                />
                            </TextFieldRoot>
                        </OutsideClickAlerter>
                    )}
            </AccordionHeader>
            <AccordionContent>
                {children}
            </AccordionContent>
        </Accordion.Item>
    )
}
