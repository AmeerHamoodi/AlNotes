import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

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

const Note = observer(({ match }: RouteComponentProps<RouteDetails>) => {

    const { id, className, unitName } = match.params;

    const { noteContent, noteName } = noteStore;

    useEffect(() => {
        noteStore.getNote(className, unitName, id);
    }, []);

    return (
        <>
            {
               //! DO NOT REMOVE THIS
                //I really don't know why, but it makes this whole component work
                noteStore.noteLoaded ? <TopBar backLink={`/class/${match.params.className}/unit/${match.params.unitName}`}
                unitName={match.params.unitName} name={noteName}
                ></TopBar> : <TopBar backLink={`/class/${match.params.className}/unit/${match.params.unitName}`}
                    unitName={match.params.unitName} name={"Note name"}
                ></TopBar>
            }
            <Editor content={noteContent} store={noteStore}></Editor>
        </>
    )
});

export default Note;