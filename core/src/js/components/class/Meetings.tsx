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

const Meetings = observer(({ classItemsStore, className }: UnitsPropsInterface) => {
    const [meetingName, setMeetingName] = useState("");
    const [meetingLink, setMeetingLink] = useState("");


    const createMeetingInternal = () => {
        classItemsStore.createClassItem(className, "meeting", {
            name: meetingName,
            link: meetingLink
        });

        setMeetingName("");
        setMeetingLink("");
    }

    const meetings = classItemsStore.meetings.map((item: ClassItem) => {
        item.icon = "users";

        return item;
    });

    const handleChangeName = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setMeetingName(input.value);   
    };

    const handleChangeLink = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setMeetingLink(input.value);   
    };

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Meetings:</h2>
            {
                classItemsStore.contentLoaded ? <List data={meetings}></List> : ""
            }
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createMeetingInternal}>
                <div className="field">
                    <label>Meeting name:</label>
                    <input type="text" id="meetingName" placeholder="Enter the meeting name" value={meetingName} onChange={handleChangeName} />
                </div>
                <div className="field">
                    <label>Meeting link:</label>
                    <input type="text" id="meetingLink" placeholder="Enter the link of the meeting" value={meetingLink} onChange={handleChangeLink} />
                </div>
            </CreateNew>
        </>
    )
});

export default Meetings;