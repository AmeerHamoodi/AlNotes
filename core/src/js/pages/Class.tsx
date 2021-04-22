import React, { useEffect } from "react";
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

//INTERFACES
interface ClassProps {
    match: {
        params: {
            name: string
        }
    }
}

const unitsStore = new UnitsStore();
const classItemsStore = new ClassItemsStore();

const Class = observer((props: ClassProps) => {

    useEffect(() => {
        unitsStore.getUnits(props.match.params.name);
        classItemsStore.getClassContent(props.match.params.name);
    }, []);

    return (
        <>
            <Navbar backLink="/" username={"Development"}></Navbar>
            <h1 style={{ textAlign: "center" }}>{props.match.params.name}</h1>
            {
                unitsStore.unitsLoaded ? <Units unitsData={unitsStore.units} unitsStore={unitsStore} className={props.match.params.name}></Units>
                    : <h3 style={{ textAlign: "center" }}>Loading units</h3>
            }
            <Error toShow={unitsStore.errorContent.occured} textToShow={unitsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Textbooks classItemsStore={classItemsStore} className={props.match.params.name}></Textbooks>
                : <h3 style={{textAlign: "center"}}>Loading textbooks</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Labs classItemsStore={classItemsStore} className={props.match.params.name}></Labs>
                : <h3 style={{textAlign: "center"}}>Loading labs</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
            {
                classItemsStore.contentLoaded ? <Meetings classItemsStore={classItemsStore} className={props.match.params.name}></Meetings>
                : <h3 style={{textAlign: "center"}}>Loading meetings</h3>
            }
            <Error toShow={classItemsStore.errorContent.occured} textToShow={classItemsStore.errorContent.data}></Error>
        </>
    );
});

export default Class;