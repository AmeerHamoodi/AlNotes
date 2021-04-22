import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

//STORES
import UnitsStore from "../stores/unitsStore";
import ClassItemsStore from "../stores/classItemsStore";

//COMPONENTS
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import Units from "../components/class/Units";
import Textbooks from "../components/class/Textbooks";
import Labs from "../components/class/Labs";
import Meetings from "../components/class/Meetings";

//TYPES
type RouteDetails = {
    name: string
}

const unitsStore = new UnitsStore();
const classItemsStore = new ClassItemsStore();

const Class = observer(({ match }: RouteComponentProps<RouteDetails>) => {

    useEffect(() => {
        unitsStore.getUnits(match.params.name);
        classItemsStore.getClassContent(match.params.name);
    }, []);

    return (
        <>
            <Navbar backLink="/" username={"Development"}></Navbar>
            <h1 style={{ textAlign: "center" }}>{match.params.name}</h1>
            {
                unitsStore.unitsLoaded ? <Units unitsData={unitsStore.units} unitsStore={unitsStore} className={match.params.name}></Units>
                    : <h3 style={{ textAlign: "center" }}>Loading units</h3>
            }
            <Error toShow={unitsStore.errorContent.occured} textToShow={unitsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Textbooks classItemsStore={classItemsStore} className={match.params.name}></Textbooks>
                    : <h3 style={{ textAlign: "center" }}>Loading textbooks</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Labs classItemsStore={classItemsStore} className={match.params.name}></Labs>
                    : <h3 style={{ textAlign: "center" }}>Loading labs</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Meetings classItemsStore={classItemsStore} className={match.params.name}></Meetings>
                    : <h3 style={{ textAlign: "center" }}>Loading meetings</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
        </>
    );
});

export default Class;