import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

//COMPONENTS
import Navbar from "../components/Navbar";
import CardsContainer from "../components/CardsContainer";
import CreateNew from "../components/CreateNew";
import Error from "../components/Error";
import { Container } from "semantic-ui-react";

//STORES
import ClassesStore from "../stores/homePage/ClassesStore";

//INTERFACES
import { ClassesStoreInterface } from "../stores/interfaces";

const classesStore: ClassesStoreInterface = new ClassesStore();

const Home = observer((props) => {
    const [className, setClassName] = useState("");
    useEffect(() => {
        classesStore.getClasses();
    }, []);

    const createClass = () => {
        classesStore.createClass(className);
        setClassName("");
    };

    const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const input = el.target as HTMLInputElement;
        setClassName(input.value);
    };

    return (
        <>
            <Navbar backLink="/" username={"Development"}></Navbar>
            <Container className="mt">
                <h1 style={{ textAlign: "center" }}>Classes:</h1>
                {classesStore.classesLoaded ? (
                    <CardsContainer
                        data={classesStore.classes}
                        emptyMessage="No classes."
                    ></CardsContainer>
                ) : (
                    <h3 style={{ textAlign: "center" }}>Loading classes...</h3>
                )}
                <CreateNew
                    title="Create new class"
                    onClick={createClass}
                    creationText="Create class"
                >
                    <div className="field">
                        <label>Class name:</label>
                        <input
                            type="text"
                            id="classname"
                            placeholder="Enter class name"
                            value={className}
                            onChange={handleChange}
                        />
                    </div>
                    <Error
                        toShow={classesStore.errorContent.occured}
                        textToShow={classesStore.errorContent.data}
                    ></Error>
                </CreateNew>
            </Container>
        </>
    );
});

export default Home;
