import React, {useEffect} from "react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Navbar from "../components/Navbar";
import CardsContainer from "../components/CardsContainer";
import Error from "../components/Error";

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
    useEffect(() => {
        notesStore.getNotes(match.params.className, match.params.unitName);
    }, []);
    return (
        <>
            <Navbar backLink={`/class/${match.params.className}`} username="Development"></Navbar>
            <h1 style={{ textAlign: "center" }}>{match.params.unitName}:</h1>
            {
                notesStore.notesLoaded ? <CardsContainer data={notesStore.notes} emptyMessage="No notes."></CardsContainer>
                : <h3 style={{textAlign: "center"}}>Loading notes...</h3>
            }
            <div className="container mt">
                <Error toShow={notesStore.errorContent.occured} textToShow={notesStore.errorContent.data}></Error>
                <div className="fluid ui button primary">Create note</div>
            </div>
        </>
    )
});

export default Unit;