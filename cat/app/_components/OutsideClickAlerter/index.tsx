import React, { RefObject, ReactNode, useEffect, useRef } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClickAlerter(ref: RefObject<HTMLDivElement>, onOutsideClick: (e: MouseEvent) => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClick(event: MouseEvent) {
            if (ref?.current && !(ref.current as Node).contains(event.target as Node)) {
                onOutsideClick(event);
                event.stopPropagation();
                event.preventDefault();
            }
        }
        // NOTE: By using the on click event, the outside clicker may conflict with
        //       other events, such as when adding new menu items
        // Bind the event listener
        document.addEventListener("mousedown", handleClick);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClick);
        };
    }, [ref]);
}

interface AlerterProps {
    children: ReactNode;
    onOutsideClick: (e: MouseEvent) => void;
}

/**
 * Component that alerts if you click outside of it
 */
const OutsideClickAlerter = ({ children, onOutsideClick }: AlerterProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClickAlerter(wrapperRef, onOutsideClick);

    return <div ref={wrapperRef}>{children}</div>;
}

export default OutsideClickAlerter;