import React, { FC, useState, useRef } from "react";
import ReactQuill from "react-quill";


const Editor: FC = () => {
    const [noteValue, setNoteValue] = useState({editorContent: ""});
    const editorRef: {current: ReactQuill} = useRef();

    const handleChange = (value: string) => {
        setNoteValue({
            editorContent: value
        });
    }

    return (
        <ReactQuill
            onChange={handleChange}
            placeholder=""
            theme="snow"
            ref={(el) => {editorRef.current = el}}
        />
    )
};

export default Editor;