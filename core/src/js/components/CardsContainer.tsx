import React from "react";
import Card from "./Card";
import { observer } from "mobx-react-lite";

interface CardsContainerProps {
    data: object[],
    emptyMessage: string
}

const CardsContainer = observer(({ data, emptyMessage }: CardsContainerProps) => {
    return (typeof data !== "undefined" && data.length > 0) ? (
        <div className="container mt" style={{ marginLeft: "2rem", marginRight: "2rem" }}>
            <div className="gridish-flow">
                {
                    data.map((item, index) => <Card {...item} key={`card_${index}`}></Card>)
                }
            </div>
        </div>

    ) : <h3 style={{ textAlign: "center" }}>{emptyMessage}</h3>
});

export default CardsContainer;