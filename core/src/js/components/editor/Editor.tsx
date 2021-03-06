import React, { FC, useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import { observer } from "mobx-react-lite";

//CORE
import { CoreInterface } from "../../core";

//INTERFACES AND TYPES
import { NoteStoreInterface } from "../../stores/interfaces";

type EditorProps = {
    content: string;
    store: NoteStoreInterface;
    core: CoreInterface;
};

const Editor: FC<EditorProps> = observer(({ content, store, core }) => {
    const [noteValue, setNoteValue] = useState({ editorContent: "" });
    const editorRef: { current: ReactQuill } = useRef();

    const handleChange = (value: string) => {
        setNoteValue({
            editorContent: value
        });
    };

    useEffect(() => {
        core.noteStore = store;
        if (typeof editorRef.current.getEditor === "function") {
            core.coreEditor = editorRef.current.getEditor();
        }

        const interval = setInterval(async () => await core.saveNote(), 10000);

        return () => {
            clearInterval(interval);
        }

    }, []);

    return (
        <ReactQuill
            onChange={handleChange}
            placeholder=""
            theme="snow"
            modules={core.modules}
            value={noteValue.editorContent}
            ref={(el: ReactQuill) => {
                editorRef.current = el;
            }}
        />
    );
});

export default Editor;
