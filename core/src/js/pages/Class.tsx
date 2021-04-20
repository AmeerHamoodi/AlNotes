import React from "react";
import { observer } from "mobx-react-lite";

//COMPONENTS
import List from "../components/List";
import Navbar from "../components/Navbar";
import CreateNew from "../components/CreateNew";

//INTERFACES
import { UserStoreInterface } from "../stores/interfaces";


interface ClassPropsInterface {
    userStore: UserStoreInterface
}

const Class = observer(({ userStore }: ClassPropsInterface) => {
    return (
        <>
            <Navbar backLink="/home" username={userStore.username}></Navbar>
            <h1 style={{textAlign: "center"}} className="mt">Units:</h1>
            <List data={
                [
                    {
                        title: "Hello World", 
                        url: "/404"
                    },
                    {
                        title: "This is a test",
                        url: "/404"
                    },
                    {
                        title: "This is a test",
                        url: "/404"
                    },
                    {
                        title: "This is a test",
                        url: "/404"
                    },
                    {
                        title: "This is a test",
                        url: "/404"
                    },
                    {
                        title: "This is a test",
                        url: "/404"
                    }
            ]
            }></List>
            <CreateNew title="Create new unit" creationText="Create unit" onClick={console.log("heheh")}>
                <div className="field">
                    <label>Unit name:</label>
                    <input type="text" id="unitname" placeholder="Enter the unit name" />
                </div>
            </CreateNew>
        </>
    );
});

export default Class;