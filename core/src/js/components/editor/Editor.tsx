import React, { FC, useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";

//CORE
import Core, { CoreInterface } from "../../core";

const core: CoreInterface = new Core();

type EditorProps = {
    content: string
}

const Editor: FC<EditorProps> = ({content}) => {
    const [noteValue, setNoteValue] = useState({ editorContent: content });
    const editorRef: { current: Quill | any } = useRef();


    const handleChange = (value: string) => {
        setNoteValue({
            editorContent: value
        });
    };

    useEffect(() => {
        if (typeof editorRef.current.getEditor === "function") core.coreEditor = editorRef.current;
    }, []);

    return (
        <ReactQuill
            onChange={handleChange}
            placeholder=""
            theme="snow"
            modules={core.modules}
            value={content}
            ref={(el: ReactQuill) => { editorRef.current = el }}
        />
    )
};

export default Editor;