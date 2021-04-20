import React from "react";
import Card from "./Card";

interface CardsContainerProps {
    data: object[],
    generalFunction: (id: string) => void
}

const CardsContainer = ({ data, generalFunction }: CardsContainerProps) => {
    return (typeof data !== "undefined" && data.length > 0) ? (
        <div className="container mt" style={{ marginLeft: "2rem", marginRight: "2rem" }}>
            <div className="gridish-flow">
                {
                    data.map((item, index) => <Card {...item} key={`card_${index}`} deleteFunction={generalFunction}></Card>)
                }
            </div>
        </div>

    ) : <h3 style={{ textAlign: "center" }}>No classes.</h3>
};

export default CardsContainer;