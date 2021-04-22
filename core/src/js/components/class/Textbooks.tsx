import React from "react";
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

const Textbooks = observer(({ classItemsStore, className }: UnitsPropsInterface) => {

    const createTextbookinternal = () => {
        const name = $("#textbookName").val().toString();
        const link = $("#textbookLink").val().toString();

        classItemsStore.createClassItem(className, "textbook", {
            name,
            link
        });

        $("#textbookName").val("");
        $("#textbookLink").val("");
    }

    const textbooks = classItemsStore.textbooks.map((item: ClassItem) => {
        item.icon = "book";
        return item;
    });

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Textbooks:</h2>
            {
                classItemsStore.contentLoaded ? <List data={textbooks}></List> : ""
            }
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createTextbookinternal}>
                <div className="field">
                    <label>Textbook name:</label>
                    <input type="text" id="textbookName" placeholder="Enter the textbook name" />
                </div>
                <div className="field">
                    <label>Textbook link:</label>
                    <input type="text" id="textbookLink" placeholder="Enter the link of the textbook" />
                </div>
            </CreateNew>
        </>
    )
});

export default Textbooks;