import React, { useState } from "react";

import List from "../List";
import CreateNew from "../CreateNew";

import { UnitsStoreInterface } from "../../stores/interfaces";

interface UnitInterface {
    name: string,
    link: string,
    deleteFunction?: () => void,
    icon?: string | "folder" | "book" | "flask" | "users"
}

interface UnitsInterface {
    unitsData: UnitInterface[],
    unitsStore: UnitsStoreInterface,
    className: string
}

const Units = ({ unitsData, unitsStore, className }: UnitsInterface) => {
    const [unitName, setUnitName] = useState("");

    const createUnit = () => {
        unitsStore.createUnit(className, unitName);
        setUnitName("");
    }

    unitsData = unitsData.map(item => {
        item.icon = "folder";
        return item;
    });

    const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setUnitName(input.value);
    }

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Units:</h2>
            <List data={unitsData}></List>
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createUnit}>
                <div className="field">
                    <label>Unit name:</label>
                    <input type="text" id="unitname" placeholder="Enter the unit name" onChange={handleChange} value={unitName} />
                </div>
            </CreateNew>
        </>
    )
};

export default Units;