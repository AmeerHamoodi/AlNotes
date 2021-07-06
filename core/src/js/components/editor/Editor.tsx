import React, { FC, useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import { observer } from "mobx-react-lite";

//CORE
import { CoreInterface } from "../../core";

//INTERFACES AND TYPES
import {
    NoteStoreInterface,
    StudySheetStoreInterface
} from "../../stores/interfaces";

type EditorProps = {
    store: NoteStoreInterface | StudySheetStoreInterface;
    core: CoreInterface;
    isStudySheet?: boolean;
};

const Editor: FC<EditorProps> = observer(({ store, core, isStudySheet }) => {
    const [noteValue, setNoteValue] = useState({ editorContent: "" });
    const editorRef: { current: ReactQuill } = useRef();

    const handleChange = (value: string) => {
        setNoteValue({
            editorContent: value
        });
    };

    useEffect(() => {
        if (!isStudySheet) {
            const noteStore = store as NoteStoreInterface;
            core.noteStore = noteStore;
            if (
                typeof editorRef.current.getEditor === "function" &&
                typeof core.coreEditor === "undefined"
            ) {
                core.coreEditor = editorRef.current.getEditor();
            }
        } else {
            const studySheetStore = store as StudySheetStoreInterface;
            core.studySheetStore = studySheetStore;
            if (
                typeof editorRef.current.getEditor === "function" &&
                typeof core.coreEditor === "undefined"
            ) {
                core.createStudySheet(editorRef.current.getEditor());
            }
        }

        return () => {
            core.unsetAll();
        };
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
