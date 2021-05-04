import React, { FC, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import { CoreInterface } from "../../core/";

type TopBarProps = {
    name: string,
    backLink: string,
    unitName?: string,
    core: CoreInterface
}

const TopBar: FC<TopBarProps> = observer(({ name, backLink, core }) => {
    const [nameContent,setNoteName] = useState(name);
    const [saveNote, setSaveNote] = useState("Not saved...");

    const handleChange = (content: string) => {
        setNoteName(content);
    };

    useEffect(() => {
        core.infoAboutNote = {
            name: nameContent
        };
        core.attachSaveState(setSaveNote);
    }, [nameContent]);

    return (
        <nav className="ui top attached menu">
            <div className="title ui header">
                <div className="centered" contentEditable={true} onKeyDown={({ target }) => {
                    const realTarget = target as HTMLElement;
                    handleChange(realTarget.innerText)

                }} onKeyUp={({ target }) => {
                    const realTarget = target as HTMLElement;
                    handleChange(realTarget.innerText)

                }} suppressContentEditableWarning={true}>{name}</div>
            </div>
            <Link to="/" className="ui icon item"><i className="home icon"></i></Link>
            <Link to={backLink || "404"} className="ui icon item"><i className="folder icon"></i></Link>
            <div className="ui icon item"><i className="save icon"></i> <span style={{fontSize: "0.7em", marginLeft:"5px"}}>{saveNote}</span> </div>
        </nav>
    )
});

export default TopBar;