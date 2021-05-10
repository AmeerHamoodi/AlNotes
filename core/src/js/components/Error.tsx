import React from "react";
import { Message } from "semantic-ui-react";

interface ErrorProps {
    toShow: boolean;
    textToShow: string;
}

const Error = ({ toShow, textToShow }: ErrorProps) => {
    return toShow ? (
        <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{textToShow}</p>
        </Message>
    ) : (
        <div></div>
    );
};

export default Error;
