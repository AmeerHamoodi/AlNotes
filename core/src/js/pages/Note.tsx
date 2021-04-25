import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Editor from "../components/editor/Editor";
import TopBar from "../components/editor/TopBar";


//STORES
import NoteStore from "../stores/noteStore";

//TYPES
type RouteDetails = {
    id: string,
    className: string,
    unitName: string
}

const noteStore = new NoteStore();

const Note = ({ match }: RouteComponentProps<RouteDetails>) => {

    useEffect(() => {
        const { id, className, unitName } = match.params;
        noteStore.getNote(className, unitName, id);
    }, []);

    return (
        <>
            <TopBar backLink={`/class/${match.params.className}/unit/${match.params.unitName}`}
                unitName={match.params.unitName} name={noteStore.noteTitle}
            ></TopBar>
            <Editor content={noteStore.noteContent}></Editor>
        </>
    )
};

export default Note;