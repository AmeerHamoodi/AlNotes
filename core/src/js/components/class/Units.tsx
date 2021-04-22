import React from "react";

import List from "../List";
import CreateNew from "../CreateNew";

import { UnitsStoreInterface } from "../../stores/interfaces";

interface UnitInterface {
    name: string,
    link: string,
    classroomName?: string,
    className?: string,
    deleteFunction?: (className: string, unitName: string) => void,
    icon?: string | "folder" | "book" | "flask" | "users"
}

interface UnitsInterface {
    unitsData: UnitInterface[],
    unitsStore: UnitsStoreInterface,
    className: string
}

const Units = ({ unitsData, unitsStore, className }: UnitsInterface) => {

    const createUnit = () => {
        const unitName = $("#unitname").val();
        unitsStore.createUnit(className, unitName.toString());
        $("#unitname").val("");
    }

    const deleteUnit = (className: string, unitName: string) => {
        if (confirm("Are you sure you want to delete this unit? This is irreversiable")) unitsStore.deleteUnit(className, unitName);
    };

    unitsData = unitsData.map(item => {
        item.deleteFunction = deleteUnit;
        item.className = className;
        item.icon = "folder";

        return item;
    });

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Units:</h2>
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