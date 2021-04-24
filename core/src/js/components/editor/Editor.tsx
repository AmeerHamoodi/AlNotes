import React, { FC, useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";

//CORE
import Core, { CoreInterface } from "../../core";

const core: CoreInterface = new Core();

const Editor: FC = () => {
    const [noteValue, setNoteValue] = useState({editorContent: ""});
    const editorRef: {current: Quill | any} = useRef();


    const handleChange = (value: string) => {
        setNoteValue({
            editorContent: value
        });
    };

    useEffect(() => {
        if(typeof editorRef.current.getEditor === "function") core.coreEditor = editorRef.current;
    }, []);

    return (
        <ReactQuill
            onChange={handleChange}
            placeholder=""
            theme="snow"
            modules={core.modules}
            ref={(el) => {editorRef.current = el}}
        />
    )
};

export default Editor;