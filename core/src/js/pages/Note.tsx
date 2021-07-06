import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

//COMPONENTS
import Editor from "../components/editor/Editor";
import TopBar from "../components/editor/TopBar";
import TemplateSearch from "../components/editor/TemplateSearch";

//CORE
import Core, { CoreInterface } from "../core";

//STORES
import NoteStore from "../stores/notePage/NoteStore";

//TYPES
type RouteDetails = {
    id: string;
    className: string;
    unitName: string;
};

const noteStore = new NoteStore();

const core: CoreInterface = new Core();

const Note = observer(({ match }: RouteComponentProps<RouteDetails>) => {
    const { id, className, unitName } = match.params;

    const { noteName } = noteStore;

    useEffect(() => {
        noteStore.getNote(className, unitName, id);

        return () => {
            noteStore.setUnloaded();
            //Prevents render issue
        };
    }, []);

    return (
        <>
            {noteStore.noteLoaded ? (
                <>
                    <TopBar
                        backLink={`/class/${match.params.className}/unit/${match.params.unitName}`}
                        unitName={match.params.unitName}
                        name={noteName}
                        core={core}
                    ></TopBar>
                    <Editor store={noteStore} core={core}></Editor>
                    <TemplateSearch
                        toShow={noteStore.showTemplateSearch}
                        store={noteStore}
                    ></TemplateSearch>
                </>
            ) : (
                <div className="ui active dimmer massive inverted">
                    <div className="ui text loader">Loading</div>
                </div>
            )}
        </>
    );
});

export default Note;
