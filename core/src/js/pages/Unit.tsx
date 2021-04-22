import React from "react";
import { RouteComponentProps } from "react-router-dom";

//COMPONENTS
import Navbar from "../components/Navbar";

//TYPES
type RouteDetails = {
    unitName: string,
    className: string
}

const Unit = ({ match }: RouteComponentProps<RouteDetails>) => {
    return (
        <>
            <Navbar backLink={`/class/${match.params.className}`} username="Development"></Navbar>
            <h1 style={{ textAlign: "center" }}>{match.params.unitName}:</h1>
        </>
    )
};

export default Unit;