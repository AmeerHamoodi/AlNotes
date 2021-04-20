import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

//COMPONENTS
import Navbar from "../components/Navbar";
import CardsContainer from "../components/CardsContainer";
import CreateNew from "../components/CreateNew";
import Error from "../components/Error";

//STORES
import ClassesStore from "../stores/classesStore";


//INTERFACES
import { ClassesStoreInterface } from "../stores/interfaces";


const classesStore: ClassesStoreInterface = new ClassesStore();

const Home = observer(() => {
    const [toReload, setToReload] = useState(false);


    useEffect(() => {
        classesStore.getClasses();
    }, [toReload]);

    const createClass = () => {
        const className = $("#classname").val().toString();
        classesStore.createClass(className);
        $("#classname").val("");
    }


    return (
        <>
            <Navbar backLink="/" username={"Development"}></Navbar>
            <h1 style={{ textAlign: "center" }}>Classes:</h1>
            {
                classesStore.classesLoaded ?
                    <CardsContainer data={classesStore.classes} generalFunction={() => 0}></CardsContainer> :
                    <h1 style={{ textAlign: "center" }}>Loading...</h1>
            }
            <CreateNew title="Create new class" onClick={createClass}
                creationText="Create class">
                <div className="field">
                    <label>Class name:</label>
                    <input type="text" id="classname" placeholder="Enter class name" />
                </div>
                <Error toShow={classesStore.errorContent.occured}
                    textToShow={classesStore.errorContent.data}></Error>
            </CreateNew>
        </>

    )
});

export default Home;