import React from "react";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Editor from "../components/editor/Editor";
import TopBar from "../components/editor/TopBar";


//TYPES
type RouteDetails = {
    id: string,
    className: string,
    unitName: string
}

const Note = ({ match }: RouteComponentProps<RouteDetails>) => {
    return (
        <>
            <TopBar backLink={`/class/${match.params.className}/unit/${match.params.unitName}`}
                unitName={match.params.unitName} name="Note Name"
            ></TopBar>
            <Editor></Editor>
        </>
    )
};

export default Note;