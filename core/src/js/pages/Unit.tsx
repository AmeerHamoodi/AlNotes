import React from "react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Navbar from "../components/Navbar";
import List from "../components/List";

//STORES
import NotesStore from "../stores/notesStore";

//TYPES and INTERFACES
import { NotesStoreInterface } from "../stores/interfaces";
type RouteDetails = {
    unitName: string,
    className: string
}


const notesStore: NotesStoreInterface = new NotesStore();

const Unit = observer(({ match }: RouteComponentProps<RouteDetails>) => {
    return (
        <>
            <Navbar backLink={`/class/${match.params.className}`} username="Development"></Navbar>
            <h1 style={{ textAlign: "center" }}>{match.params.unitName}:</h1>
        </>
    )
});

export default Unit;