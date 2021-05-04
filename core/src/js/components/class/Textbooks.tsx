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

const Textbooks = observer(({ classItemsStore, className }: UnitsPropsInterface) => {
    const [textbookName, setTextbookName] = useState("");
    const [textbookLink, setTextbookLink] = useState("");


    const createTextbookinternal = () => {
        classItemsStore.createClassItem(className, "textbook", {
            name: textbookName,
            link: textbookLink
        });

        setTextbookLink("");
        setTextbookName("");
    }

    const textbooks = classItemsStore.textbooks.map((item: ClassItem) => {
        item.icon = "book";
        return item;
    });


    const handleChangeName = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setTextbookName(input.value);
    };

    const handleChangeLink = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setTextbookLink(input.value);
    }


    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Textbooks:</h2>
            {
                classItemsStore.contentLoaded ? <List data={textbooks}></List> : ""
            }
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createTextbookinternal}>
                <div className="field">
                    <label>Textbook name:</label>
                    <input type="text" id="textbookName" placeholder="Enter the textbook name" value={textbookName} onChange={handleChangeName} />
                </div>
                <div className="field">
                    <label>Textbook link:</label>
                    <input type="text" id="textbookLink" placeholder="Enter the link of the textbook" value={textbookLink} onChange={handleChangeLink} />
                </div>
            </CreateNew>
        </>
    )
});

export default Textbooks;