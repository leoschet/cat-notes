"use client"

import { Flex } from '@radix-ui/themes';
import { useRouter, useSearchParams } from "next/navigation";
import DarkModeSwitch from "../DarkModeSwitch";
import { ItemInfo, Menu, Sidebar } from "../Sidebar";

interface NavbarProps {
    appPortalId: string;
}

export default function Navbar({ appPortalId }: NavbarProps) {
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
    // Menu Item Navigation
    const searchParams = useSearchParams();
    const router = useRouter()

    const navigateToMenuItem = (item: ItemInfo) => {
        // const params = new URLSearchParams(searchParams);
        // params.set("id", item.id);
        // router.push(`/?${params.toString()}`)
        router.push(`/${item.id}`)
    }
    // ------------------------------

    const menuPropPack = { appPortalId, navigateToMenuItem }

    return (
        <Sidebar>
            <Flex
                className="MenuHeader"
                style={{ justifyContent: "right", marginBottom: "1em" }}
            >
                <DarkModeSwitch size="1" />
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
    );
}
