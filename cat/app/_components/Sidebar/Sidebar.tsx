"use client"

import { Flex } from '@radix-ui/themes';
import { ReactElement } from 'react';
import { MenuProps } from './Menu';
import "./sidebar.css";

export interface SidebarProps {
    children: ReactElement<MenuProps> | Array<ReactElement<MenuProps>>;
}

export const Sidebar = ({ children }: SidebarProps) => {
    return (
        <Flex direction="column" className="Sidebar">
            {children}
        </Flex>
    )
}