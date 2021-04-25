import React, { FC, useState } from "react";
import { Link } from "react-router-dom"

type TopBarProps = {
    name: string,
    backLink: string,
    unitName: string
}

const TopBar: FC<TopBarProps> = ({ name, backLink, unitName }) => {
    const [noteName, setNoteName] = useState("");

    const handleChange = (content: string) => {
        setNoteName(content);
    }

    return (
        <nav className="ui top attached menu">
            <div className="title ui header">
                <div className="centered" contentEditable={true} onChange={({ target }) => {
                    const realTarget = target as HTMLElement;
                    handleChange(realTarget.innerText)
                }}>{name}</div>
            </div>
            <Link to="/" className="ui icon item"><i className="home icon"></i></Link>
            <Link to={backLink || "404"} className="ui icon item"><i className="folder icon"></i></Link>
        </nav>
    )
};

export default TopBar;