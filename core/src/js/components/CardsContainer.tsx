import React from "react";
import CardInternal from "./Card";
import { observer } from "mobx-react-lite";

interface CardsContainerProps {
    data: object[];
    emptyMessage: string;
}

const CardsContainer = observer(
    ({ data, emptyMessage }: CardsContainerProps) => {
        return typeof data !== "undefined" && data.length > 0 ? (
            <div
                className="container mt"
                style={{ marginLeft: "2rem", marginRight: "2rem" }}
            >
                <div className="gridish-flow">
                    {data.map((item, index) => (
                        <CardInternal
                            {...item}
                            key={`card_${index}`}
                        ></CardInternal>
                    ))}
                </div>
            </div>
        ) : (
            <h3 style={{ textAlign: "center" }}>{emptyMessage}</h3>
        );
    }
);

export default CardsContainer;
