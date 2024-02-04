export async function loadEditorJS() {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    return EditorJS;
}

export async function loadDefaultTools() {
    const Header = (await import("@editorjs/header")).default;
    const NestedList = (await import("@editorjs/nested-list")).default;

    return {
        header: Header,
        list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
                defaultStyle: "unordered"
            },
        },
    };
}