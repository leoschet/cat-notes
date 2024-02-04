"use client";

import { OutputData } from '@editorjs/editorjs';
import { Flex, Heading } from "@radix-ui/themes";
import { cloneDeep } from "lodash-es";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from 'react';

const Editor = dynamic(() => import("../../_components/Editor"), {
    ssr: false
});

interface PagesBlocks {
    [id: string]: OutputData
}

interface ArticlePageProps {
    params: { articleId: string }
}

export default function ArticlePage({ params }: ArticlePageProps) {
    // App memory to fake data persistence
    const [pagesBlocks, setPagesBlocks] = useState<PagesBlocks>({})

    const pagesBlocksRef = useRef<PagesBlocks>(pagesBlocks)

    useEffect(() => {
        pagesBlocksRef.current = pagesBlocks
    }, [pagesBlocks])

    const savePageBlocks = (id: string, data: OutputData) => {
        console.log(JSON.stringify(data))
        pagesBlocksRef.current[id] = data
        setPagesBlocks(cloneDeep(pagesBlocksRef.current))
    }
    // ------------------------------

    return (
        <>
            {/* This mimics the div structure from EditorJS */}
            <Flex>
                {/* Sets a minimum spacing */}
                <div className="w-[100%] px-[1em] pt-[1em]">
                    {/* Responsive margin */}
                    <div className="items-left max-w-[650px] my-0 mx-auto">
                        <Heading className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
                            {params.articleId}
                        </Heading>
                    </div>
                </div>
            </Flex>
            {Editor && <Flex>
                <Editor
                    id={params.articleId}
                    autofocus={true}
                    data={pagesBlocks[params.articleId]}
                    save={savePageBlocks}
                />
            </Flex>
            }
        </>
    );
}
