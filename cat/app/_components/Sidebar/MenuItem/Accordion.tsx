"use client"

import * as Accordion from '@radix-ui/react-accordion';
import { Box, Flex, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import React, { ReactNode, Ref, useState } from 'react';
import { IoAddOutline, IoChevronForward, IoEllipsisHorizontal } from "react-icons/io5";
import "../sidebar.css";

interface AccordionProps {
    children?: ReactNode;
    className?: string;
}

interface AccordionHeaderProps extends AccordionProps {
    triggerOpenClose: () => void;
    onAddClick?: () => void;
}

export const AccordionHeader = React.forwardRef(({ children, className, triggerOpenClose, onAddClick, ...props }: AccordionHeaderProps, forwardedRef) => {
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

export const AccordionContent = React.forwardRef(({ children, className, ...props }: AccordionProps, forwardedRef) => (
    <Accordion.Content
        className={classNames('AccordionContent', className)}
        {...props}
        ref={forwardedRef as Ref<HTMLDivElement>}
    >
        {children || <Text className="AccordionContentText">No pages inside</Text>}
        {/* <div className="AccordionContentText">{children || "No pages inside"}</div> */}
    </Accordion.Content>
));

