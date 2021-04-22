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

const Meetings = observer(({ classItemsStore, className }: UnitsPropsInterface) => {

    const createMeetingInternal = () => {
        const name = $("#meetingName").val().toString();
        const link = $("#meetingLink").val().toString();

        classItemsStore.createClassItem(className, "meeting", {
            name,
            link
        });

        $("#meetingName").val("");
        $("#meetingLink").val("");
    }

    return (
        <>
            <h2 style={{ textAlign: "center" }} className="mt">Meetings:</h2>
            <List data={classItemsStore.meetings}></List>
            <CreateNew title="Create new unit" creationText="Create unit" onClick={createMeetingInternal}>
                <div className="field">
                    <label>Meeting name:</label>
                    <input type="text" id="meetingName" placeholder="Enter the meeting name" />
                </div>
                <div className="field">
                    <label>Meeting link:</label>
                    <input type="text" id="meetingLink" placeholder="Enter the link of the meeting" />
                </div>
            </CreateNew>
        </>
    )
});

export default Meetings;