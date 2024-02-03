"use client"

import { Root as AccordionRoot } from '@radix-ui/react-accordion';
import { Box, Flex, Text } from '@radix-ui/themes';
import { cloneDeep } from "lodash-es";
import { useEffect, useRef, useState } from 'react';
import { IoAddOutline } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import { ItemInfo, MenuItem } from './MenuItem';
import "./sidebar.css";


export interface MenuProps {
    title: string;
    appPortalId: string;
    includeAddButton?: boolean;
    menuItems?: ItemInfo[];
    saveItems?: (items: ItemInfo[]) => void;
    setOpenPageInfo?: (item: ItemInfo) => void;
}

export const Menu = ({
    title,
    appPortalId,
    includeAddButton,
    menuItems,
    saveItems,
    setOpenPageInfo
}: MenuProps) => {
    const [items, setItems] = useState<ItemInfo[]>(menuItems || []);
    const [openItems, setOpenItems] = useState<string[]>([]);

    const itemsRef = useRef<ItemInfo[]>(items);

    useEffect(() => {
        itemsRef.current = items
        saveItems && saveItems(items)
    }, [items])

    const upsertItem = (newItem: ItemInfo, idBreadCrumbs: string[]) => {
        // Copy bread crumbs
        const parentsId = [...idBreadCrumbs];

        // Follow parentIds in items and find the index of all parents
        let currentParent: ItemInfo | undefined;
        let currentItems = itemsRef.current;
        while (parentsId.length > 0) {
            const parentId = parentsId.shift();
            const currentParentIndex = currentItems.findIndex((item) => item.id === parentId);

            if (currentParentIndex === -1) {
                throw new Error("Error while adding menu item. Could not find parent item.");
            }

            currentParent = currentItems[currentParentIndex];

            if (!currentParent.subItems) {
                currentParent.subItems = [];
            }
            currentItems = currentParent.subItems;
        }

        const selfIndex = currentItems.findIndex((item) => item.id === newItem.id);
        if (selfIndex !== -1) {
            // Update existing item
            currentItems[selfIndex] = { ...newItem };
            console.log("newItem", newItem)
            console.log("currentItems[selfIndex]", currentItems[selfIndex])
        } else {
            if (!currentParent) {
                // Adding a top level item
                itemsRef.current.push(newItem)
            } else {
                // Last current parent is the immediate parent of the new item
                currentParent.subItems = currentParent.subItems ? [...currentParent.subItems, newItem] : [newItem];
            }
        }

        // Trigger rerender
        setItems(cloneDeep(itemsRef.current));
    }

    const toggleItem = (id: string, forceOpen?: boolean) => {
        if (!forceOpen && openItems.includes(id)) {
            setOpenItems(openItems.filter((item) => item !== id));
        } else {
            setOpenItems([...openItems, id]);
        }
    }

    // Recursively render menu items
    const renderItems = (items: ItemInfo[], parentsIdBreadCrumbs: string[] = []) => {
        return items.map((item) => {
            const menuItemPropsPack = {
                appPortalId,
                parentsIdBreadCrumbs,
                toggleItem,
                upsertItem,
                setOpenPageInfo,
                id: item.id,
                text: item.title,
                emoji: item.emoji,
                children: item.subItems && renderItems(item.subItems, [...parentsIdBreadCrumbs, item.id]),
            }

            return (
                // Each child in a list should have a unique "key" prop. 
                <MenuItem key={item.id} {...menuItemPropsPack} />
            )
        })
    }

    const renderedItems = renderItems(itemsRef.current)
    return (
        <AccordionRoot
            className="AccordionRoot"
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
        >
            <Flex className="MenuHeader">
                <Flex className="HeaderContent HoverBox">
                    <Text>{title}</Text>
                    {/* <Text className="MenuHeaderText">{title}</Text> */}
                </Flex>
                {includeAddButton &&
                    (<Flex className="HeaderContent">
                        <Box className="HoverBox Square">
                            <IoAddOutline size={12} onClick={() => {
                                upsertItem(
                                    { id: uuidv4(), title: undefined, emoji: undefined },
                                    []
                                )
                            }} />
                        </Box>
                    </Flex>)
                }
            </Flex>
            {renderedItems}
        </AccordionRoot>
    )
}