"use client"

import { useCallback } from "react";

import { AccordionItem } from '@radix-ui/react-accordion';
import { Box, Text, TextFieldInput, TextFieldRoot } from '@radix-ui/themes';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import OutsideClickAlerter from '../../OutsideClickAlerter';
import Icon from '../Icon';
import "../sidebar.css";
import { AccordionContent, AccordionHeader } from './Accordion';

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
    navigateToMenuItem?: (item: ItemInfo) => void;
    id?: string;
    text?: string;
    emoji?: string;
    children?: ReactElement<MenuItemProps> | Array<ReactElement<MenuItemProps>>;
}

export default function MenuItem({
    appPortalId,
    parentsIdBreadCrumbs,
    toggleItem,
    upsertItem,
    navigateToMenuItem,
    id,
    text,
    emoji,
    children,
}: MenuItemProps) {
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

    const navigateToSelf = useCallback(() => {
        navigateToMenuItem?.({ id: menuItemId, title: itemText, emoji: emojiCode });
    }, [menuItemId, itemText, emojiCode, navigateToMenuItem])

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
        navigateToSelf();
    }

    const setEmojiCode = (newEmojiCode: string) => {
        _setEmojiCode(newEmojiCode);

        const item = { id: menuItemId, title: itemText, emoji: newEmojiCode };
        upsertItem(item, parentsIdBreadCrumbs);
    }

    return (
        <AccordionItem key={menuItemId} value={menuItemId}>
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
                    (<Text onClick={navigateToSelf}>
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
        </AccordionItem>
    )
}
