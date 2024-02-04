"use client";

import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import { Heading } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { loadDefaultTools, loadEditorJS } from "./editorjs";
import "./styles.css";

interface EditorProps extends Omit<EditorConfig, "holderId" | "holder"> {
    id: string;
    save?: (id: string, data: OutputData) => void;
    children?: React.ReactElement;
}

export default function Editor({
    id,
    data: initialData,
    onChange,
    onReady,
    save,
    children,
    tools,
    ...restProps
}: EditorProps) {
    const [mounted, setMounted] = useState(false)

    const memoizedHolder = React.useRef(id)
    const editorJS = React.useRef<EditorJS | undefined>()

    // This indicates the component is mounted in the client.
    // Without this logic, we cannot instantiate the EditorJS class.
    useEffect(() => setMounted(true), [])

    const initEditorJS = async () => {
        const EditorJS = await loadEditorJS()
        const tools = await loadDefaultTools()

        editorJS.current = new EditorJS({
            // holder: memoizedHolder.current,
            holder: id,
            data: initialData,
            placeholder: "What great idea is on your mind today?",
            onChange: async (api, event) => {
                editorJS.current?.saver.save()
                    .then((outputData: OutputData) => save?.(id, outputData));
            },
            tools: {
                ...tools,
                ...(tools || {})
            },
            ...restProps,
        });
    }

    useEffect(() => {
        if (mounted) {
            initEditorJS()
        }

        return () => {
            editorJS.current?.saver.save()
                .then((outputData: OutputData) => save?.(id, outputData))

            editorJS.current?.destroy()
        }
    }, [mounted])

    return <>
        {!mounted &&
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <Heading className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
                    Loading...
                </Heading>
            </div>}
        {children || <div
            id={id}
            style={{ width: "100%", textAlign: "left", padding: "1em" }}
        />}
    </>
};
