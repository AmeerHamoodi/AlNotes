import React, {useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Navbar from "../components/Navbar";
import CardsContainer from "../components/CardsContainer";
import CreateNew from "../components/CreateNew";
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
    const [unitName, setUnitName] = useState("");


    useEffect(() => {
        notesStore.getNotes(match.params.className, match.params.unitName);
    }, []);


    const createNote = () => {
        const value = $("#notename").val().toString();
        notesStore.createNote(match.params.className, match.params.unitName, value);
        $("#notename").val("");
    }

    const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setUnitName(input.value);
    }

    return (
        <>
            <Navbar backLink={`/class/${match.params.className}`} username="Development"></Navbar>
            <h1 style={{ textAlign: "center" }}>{match.params.unitName}:</h1>
            {
                notesStore.notesLoaded ? <CardsContainer data={notesStore.notes} emptyMessage="No notes."></CardsContainer>
                : <div className="ui active dimmer massive inverted">
                    <div className="ui text loader">Loading</div>
                </div>
            }
            <div className="container mt">
                <Error toShow={notesStore.errorContent.occured} textToShow={notesStore.errorContent.data}></Error>
                <CreateNew title="New note" creationText="Create new note" onClick={createNote}>
                    <div className="field">
                        <label>Note name:</label>
                        <input type="text" id="notename" placeholder="Enter name of note" value={unitName} onChange={handleChange} />
                    </div>
                </CreateNew>
            </div>
        </>
    )
});

export default Unit;