import React from "react";

interface ErrorProps {
    toShow: boolean,
    textToShow: string
}

const Error = ({ toShow, textToShow }: ErrorProps) => {
    return toShow ? (
        <div className="ui negative message">
            <div className="header">
                Error
            </div>
            <p>{textToShow}</p>
        </div>
    ) : <div></div>
};

export default Error;