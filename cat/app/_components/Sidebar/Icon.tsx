"use client"

import { Flex } from '@radix-ui/themes';
import { Emoji, EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ReactDOM from 'react-dom';


const IoDocumentOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoDocumentOutline));
const IoDocumentTextOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoDocumentTextOutline));
const EmojiPicker = dynamic(() => import('emoji-picker-react'));
const OutsideClickAlerter = dynamic(() => import('../OutsideClickAlerter'));

interface Props {
    emojiPickerPortalId: string;
    emojiCode: string | undefined;
    saveEmojiCode: (emojiCode: string) => void;
    emptyPage: boolean;
}

const Icon = ({ emojiPickerPortalId, emojiCode, saveEmojiCode, emptyPage }: Props) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState<[number, number]>([0, 0]);

    const toggleEmojiPicker = (event: MouseEvent | React.MouseEvent) => {
        // (event as Event).stopImmediatePropagation()
        event.stopPropagation()
        event.preventDefault()

        // If it will render, set positions
        if (!showEmojiPicker) {
            const target_position = (event.target as Element).getBoundingClientRect()
            setEmojiPickerPosition([target_position.bottom, target_position.right]);
        }

        setShowEmojiPicker(!showEmojiPicker);
    };

    const updateEmoji = (emojiData: EmojiClickData) => {
        saveEmojiCode(emojiData.unified);
        // Hide emoji picker after emoji is selected
        setShowEmojiPicker(false);
    };

    return (
        <Flex>
            <Flex onClick={toggleEmojiPicker}>
                {
                    emptyPage ?
                        (<IoDocumentOutline size={12} />) :
                        emojiCode ?
                            (<Emoji unified={emojiCode} size={14} />) :
                            (<IoDocumentTextOutline size={12} />)
                }
            </Flex>
            {showEmojiPicker && ReactDOM.createPortal(
                (<OutsideClickAlerter onOutsideClick={toggleEmojiPicker}>
                    <EmojiPicker onEmojiClick={updateEmoji} style={{
                        position: "absolute",
                        top: emojiPickerPosition[0],
                        left: emojiPickerPosition[1],
                        zIndex: 100,
                    }} />
                </OutsideClickAlerter>),
                document.getElementById(emojiPickerPortalId) as Element,
            )}
        </Flex>
    )
}

export default Icon;