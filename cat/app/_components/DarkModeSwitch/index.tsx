import { Flex, Responsive, Switch } from '@radix-ui/themes';
import { IoMoon, IoSunny } from "react-icons/io5";
import "./switch.css";

interface DarkModeSwitchProps {
    size?: Responsive<"1" | "2" | "3">;
    mode?: "light" | "dark";
}

const DarkModeSwitch = ({ size, mode }: DarkModeSwitchProps) => {
    // This isn't working with Next.js.
    // useEffect is also not desirable, as the user would see the wrong theme upon loading.
    // if (mode === "dark" && !document.body.classList.contains("dark")) {
    //     document.body.classList.add("dark");
    // }

    return (
        <Flex style={{ alignItems: "center", justifyContent: "space-evenly" }}>
            <IoSunny size={12} />
            <Switch
                size={size}
                variant="soft"
                style={{ margin: "0 0.5em" }}
                // defaultChecked={mode === "dark"}
                onClick={() => {
                    document.body.classList.contains("dark") ?
                        document.body.classList.remove("dark") :
                        document.body.classList.add("dark");
                }
                }
            />
            <IoMoon size={12} />
        </Flex>
    )
};

export default DarkModeSwitch;