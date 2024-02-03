"use client"

import { Flex } from '@radix-ui/themes';
import { useState } from 'react';
import DarkModeSwitch from "./_components/DarkModeSwitch";
import { ItemInfo, Menu, Sidebar } from "./_components/Sidebar";

export default function Home() {
    // Temporary function to load initial data
    const loadInitialItems = () => {
        return [
            {
                id: "1", title: "A single page", emoji: "1fae0", subItems: [
                    { id: "2", title: "A sub page", emoji: undefined },
                    { id: "3", title: "Another sub page", emoji: undefined }
                ]
            },
            { id: "4", title: "Another single page", emoji: undefined }]
    }
    // ------------------------------
    // Temporary save functionality
    const savePageItems = (items: any) => {
        console.log("Saving `Pages` items...")
        // to string
        console.log(JSON.stringify(items, null, 2))
    }
    // ------------------------------

    const [openPageInfo, setOpenPageInfo] = useState<ItemInfo | undefined>()

    const appPortalId = "app-portal";
    const menuPropPack = { appPortalId, setOpenPageInfo }

    return (
        <main>
            <Flex id={appPortalId} style={{ position: "absolute" }} />
            <Sidebar>
                <Flex
                    className="MenuHeader"
                    style={{ justifyContent: "right", marginBottom: "1em" }}
                >
                    <DarkModeSwitch size="1" mode="dark" />
                </Flex>
                <Menu
                    title="Pages"
                    includeAddButton={true}
                    menuItems={loadInitialItems()}
                    saveItems={savePageItems}
                    {...menuPropPack}
                />
                <Menu title="Shared" {...menuPropPack} />
            </Sidebar>
        </main>
    );
}
