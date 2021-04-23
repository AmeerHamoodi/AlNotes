import React from "react";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Editor from "../components/editor/Editor";


//TYPES
type RouteDetails = {
    id: string,
    className: string,
    unitName: string
}

const Note = ({match}: RouteComponentProps<RouteDetails>) => {
    return (
        <Editor></Editor>
    )
};

export default Note;