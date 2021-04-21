import React, { useState } from "react";

import ListItem from "./ListItem";

interface ListItem {
    name: string,
    link: string
};

interface ListProps {
    data: ListItem[]
};

const List = ({data}:ListProps) => {
    const [viewAll, setViewAll] = useState(false);

    let renderData: ListItem[] = [];

    if(typeof data !== "undefined" && !viewAll) renderData = data.length > 4 ? data.slice(0, 4) : data;
    else if (typeof data !== "undefined") renderData = data;

    const updateState = () => {
        setViewAll(!viewAll);
    }


    return renderData.length > 0 ? (
        <div className="ui items mt" style={{justifyContent: "center", width:"100%"}}>
            {
                renderData.map((item: ListItem, index) => {
                    return <ListItem {... item} key={index + "_" + Math.random().toString()}></ListItem>
                })
            }
            <a onClick={updateState} className="cursor">{viewAll ? "View less" : "View all"}</a>
        </div>
    ) : <h3 style={{textAlign: "center"}}>No content</h3>
};

export default List;