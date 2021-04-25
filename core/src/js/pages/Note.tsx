import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Editor from "../components/editor/Editor";


//STORES
import NotesStore from "../stores/noteStore";

//TYPES
type RouteDetails = {
    id: string,
    className: string,
    unitName: string
}

const noteStore = new NotesStore();

const Note = ({match}: RouteComponentProps<RouteDetails>) => {

    useEffect(() => {
        const { id, className, unitName } = match.params;
        noteStore.getNote(className, unitName, id);
    }, []);

    return (
        <Editor content={noteStore.noteContent}></Editor>
    )
};

export default Note;