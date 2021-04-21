import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

//STORES
import UnitsStore from "../stores/unitsStore";

//COMPONENTS
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import Units from "../components/class/Units";

//INTERFACES
interface ClassProps {
    match: {
        params: {
            name: string
        }
    }
}

const unitsStore = new UnitsStore();

const Class = observer((props : ClassProps) => {

    useEffect(() => {
        unitsStore.getUnits(props.match.params.name);
    }, []);

    return (
        <>
            <Navbar backLink="/home" username={"Development"}></Navbar>
            {
                unitsStore.unitsLoaded ? <Units unitsData={unitsStore.units} unitsStore={unitsStore} className={props.match.params.name}></Units> 
                : <h3 style={{textAlign: "center"}}>Loading units</h3>
            }
            <Error toShow={unitsStore.errorContent.occured} textToShow={unitsStore.errorContent.data}></Error>
        </>
    );
});

export default Class;