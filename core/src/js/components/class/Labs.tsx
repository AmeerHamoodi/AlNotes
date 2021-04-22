import React from "react";
import { observer } from "mobx-react-lite";

import List from "../List";
import CreateNew from "../CreateNew";

import { ClassItemsInterface } from "../../stores/interfaces";

type ClassItem = {
    name: string,
    link: string,
    classroomName?: string,
    deleteFunction?: (className: string, itemName: string) => void,
}

interface UnitsPropsInterface {
    classItemsStore: ClassItemsInterface,
    className: string
}

const Labs = observer(({ classItemsStore, className }: UnitsPropsInterface) => {

    const createLabInternal = () => {
        const name = $("#labName").val().toString();
        const link = $("#labLink").val().toString();

        classItemsStore.createClassItem(className, "lab", {
            name,
            link
        });

        $("#labName").val("");
        $("#labLink").val("");
    };

    const labs = classItemsStore.labs.map((item: ClassItem) => {
        item.deleteFunction = (classroomName) => {
            classItemsStore.deleteClassItem(classroomName, "lab", item.name);
        };
        item.classroomName = className;

        return item;
    });

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Labs:</h2>
            {
                classItemsStore.contentLoaded ? <List data={labs}></List> : ""
            }
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createLabInternal}>
                <div className="field">
                    <label>Lab name:</label>
                    <input type="text" id="labName" placeholder="Enter the lab name" />
                </div>
                <div className="field">
                    <label>Lab link:</label>
                    <input type="text" id="labLink" placeholder="Enter the link of the lab" />
                </div>
            </CreateNew>
        </>
    )
});

export default Labs;