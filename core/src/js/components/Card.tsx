import React from "react";
import { Link } from "react-router-dom";

interface CardPropsInterface {
    name?: string,
    openMessage?: string,
    deleteMessage?: string,
    link?: string,
    deleteFunction?: () => void
}

const Card = ({ name, openMessage, deleteMessage, link, deleteFunction }: CardPropsInterface) => {

    const deleteInternal = () => {
        if(typeof deleteFunction == "function" && confirm("Are you sure you want to delete this? Please note this process is irreversible")) deleteFunction();
    }

    return (
        <div className="ui card mt">
            <div className="content">
                <Link to={link || "/404"} className="header">
                    {name || "No name"}
                </Link>
            </div>
            <div className="extra content">
                <Link className="ui bottom attached button primary" to={link || "/404"}>
                    <i className="add icon"></i>
                    {openMessage || "Open"}
                </Link>
                <div className="ui bottom attached button red" onClick={deleteInternal}>
                    <i className="trash alternate icon"></i>
                    {deleteMessage || "Delete"}
                </div>
            </div>
        </div >
    )
};

export default Card;