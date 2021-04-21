import React from "react";

import List from "../List";
import CreateNew from "../CreateNew";

import { UnitsStoreInterface } from "../../stores/interfaces";

interface UnitInterface {
    name: string,
    link: string
}

interface UnitsInterface {
    unitsData: UnitInterface[],
    unitsStore: UnitsStoreInterface,
    className: string
}

const Units = ({unitsData, unitsStore, className}: UnitsInterface) => {

    const createUnit = () => {
        const unitName = $("#unitname").val();
        unitsStore.createUnit(className, unitName.toString());
        $("#unitname").val("");    
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }} className="mt">Units:</h1>
            <List data={unitsData}></List>
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createUnit}>
                <div className="field">
                    <label>Unit name:</label>
                    <input type="text" id="unitname" placeholder="Enter the unit name" />
                </div>
            </CreateNew>
        </>
    )
};

export default Units;