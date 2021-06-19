import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";

// COMPONENTS
import Editor from "../components/editor/Editor";
import TemplateSearch from "../components/editor/TemplateSearch";
import TopBar from "../components/editor/TopBar";

// STORES
import StudySheetStore from "../stores/notePage/StudySheetStore";

//CORE
import Core, { CoreInterface } from "../core";

// INTERFACES
import { StudySheetStoreInterface } from "../stores/interfaces";

const studySheetStore: StudySheetStoreInterface = new StudySheetStore();

const core: CoreInterface = new Core();

interface RouteDetails {
    className: string;
}

const StudySheet = observer(({ match }: RouteComponentProps<RouteDetails>) => {
    const { className } = match.params;

    const { isLoaded } = studySheetStore;

    useEffect(() => {
        studySheetStore.getStudySheet(className);

        return () => {
            studySheetStore.setUnloaded();
            //Prevents render issue
        };
    }, []);

    return (
        <>
            {isLoaded ? (
                <>
                    <TopBar
                        backLink={`/class/${className}/`}
                        name={`${className} studysheet`}
                        core={core}
                        editable={false}
                    ></TopBar>
                    <Editor
                        store={studySheetStore}
                        core={core}
                        isStudySheet={true}
                    ></Editor>
                    <TemplateSearch
                        toShow={studySheetStore.showTemplateSearch}
                        store={studySheetStore}
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

export default StudySheet;
