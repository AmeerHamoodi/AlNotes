import React from "react";
import Navbar from "./Navbar";


const FOF = () => {
    return (
        <>
            <Navbar backLink="/" username="Development"></Navbar>
            <h1 style={{ textAlign: "center" }} className="absCenter">404 Error. Whatever you were looking for can't be found :(</h1>
        </>
    )
};

export default FOF;