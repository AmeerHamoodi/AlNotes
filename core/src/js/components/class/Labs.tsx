import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import List from "../List";
import CreateNew from "../CreateNew";

import { ClassItemsInterface } from "../../stores/interfaces";

type ClassItem = {
    name: string,
    link: string,
    deleteFunction?: () => void,
    icon?: string | "folder" | "book" | "flask" | "users"
}

interface UnitsPropsInterface {
    classItemsStore: ClassItemsInterface,
    className: string
}

const Labs = observer(({ classItemsStore, className }: UnitsPropsInterface) => {
    const [labName, setLabName] = useState("");
    const [labLink, setLabLink] = useState("");

    const createLabInternal = () => {
        classItemsStore.createClassItem(className, "lab", {
            name: labName,
            link: labLink
        });

        setLabName("");
        setLabLink("");
    };

    const labs = classItemsStore.labs.map((item: ClassItem) => {
        item.icon = "flask";

        return item;
    });

    const handleChangeName = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setLabName(input.value);
    };


    const handleChangeLink = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setLabLink(input.value);
    };

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Labs:</h2>
            {
                classItemsStore.contentLoaded ? <List data={labs}></List> : ""
            }
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createLabInternal}>
                <div className="field">
                    <label>Lab name:</label>
                    <input type="text" id="labName" placeholder="Enter the lab name" value={labName} onChange={handleChangeName} />
                </div>
                <div className="field">
                    <label>Lab link:</label>
                    <input type="text" id="labLink" placeholder="Enter the link of the lab" value={labLink} onChange={handleChangeLink} />
                </div>
            </CreateNew>
        </>
    )
});

export default Labs;