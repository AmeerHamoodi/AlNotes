import React from "react";
import { Link } from "react-router-dom";

interface ListItemProps {
    name?: string,
    link: string
}

const ICONS = ["folder", "book"];

const ListItem = ({name, link}: ListItemProps) => {
    return (
        <div className="item">
            <div className="ui tiny image">
                <i className="big icon book"/>
            </div>
            <div className="middle aligned content">
                <Link className="header" to={link || "/404"}>
                    {name || ""}
                </Link>
            </div>
            <div className="right aligned content" style={{marginRight: "3em"}}>
                <div className="ui red right floated button">
                    <i className="trash icon"></i> 
                    Delete
                </div>
                <Link className="ui primary right floated button" to={link || "/404"}>
                    <i className="plus icon"></i>
                    Open
                </Link>
            </div>
      </div>
    )
};

export default ListItem;