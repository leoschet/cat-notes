"use client"

import { Flex, Responsive, Switch } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { IoMoon, IoSunny } from "react-icons/io5";
import "./switch.css";

interface DarkModeSwitchProps {
    size?: Responsive<"1" | "2" | "3">;
}

const DarkModeSwitch = ({ size }: DarkModeSwitchProps) => {

    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    // This indicates the component is mounted in the client.
    // Without this logic, we cannot retrieve the correct `resolvedTheme` in the client.
    useEffect(() => setMounted(true), [])

    // This is returned during the initial rendering in the server.
    if (!mounted) return (
        <Image
            priority={false}
            // Transparent png https://png-pixel.com
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAAMCAQAAABypt0QAAAAGUlEQVR42mNkoDtgHLVy1MpRK0etHClWAgAobgAN+0DbgwAAAABJRU5ErkJggg=="
            alt="Loading Light/Dark Toggle"
            title="Loading Light/Dark Toggle"
            width={57}
            height={12}
            sizes="57x12"
        />
    )

    return (
        <Flex style={{ alignItems: "center", justifyContent: "space-evenly" }}>
            <IoSunny size={12} />
            <Switch
                size={size}
                variant="soft"
                style={{ margin: "0 0.5em" }}
                defaultChecked={resolvedTheme === "dark"}
                onClick={() => {
                    resolvedTheme === "dark" ?
                        setTheme("light") :
                        setTheme("dark");
                }
                }
            />
            <IoMoon size={12} />
        </Flex>
    )
};

export default DarkModeSwitch;