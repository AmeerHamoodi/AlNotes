import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Icon } from "semantic-ui-react";

interface CardPropsInterface {
    name?: string;
    openMessage?: string;
    deleteMessage?: string;
    link?: string;
    deleteFunction?: () => void;
    archive?: boolean;
    archiveFunction?: () => void;
}

const CardInternal = ({
    name,
    openMessage,
    deleteMessage,
    link,
    deleteFunction,
    archiveFunction
}: CardPropsInterface) => {
    const deleteInternal = () => {
        if (
            typeof deleteFunction == "function" &&
            confirm(
                "Are you sure you want to delete this? Please note this process is irreversible"
            )
        )
            deleteFunction();
    };

    const archiveInternal = () => {
        if (
            typeof archiveFunction == "function" &&
            confirm("Are you sure you want to archive this")
        )
            archiveFunction();
    };

    return (
        <Card className="mt">
            <Card.Content>
                <Card.Header as={Link} to={link || "/404"}>
                    {name || "No name"}
                </Card.Header>
            </Card.Content>
            <Card.Content extra>
                <Button.Group>
                <Button primary as={Link} to={link || "/404"} icon="add" />
                <Button negative onClick={deleteInternal} icon="trash alternate" />
                {typeof archiveFunction == "function" ? (
                    <Button
                        basic
                        color="yellow"
                        onClick={archiveInternal}
                        icon="archive"
                    />
                ) : null}
                </Button.Group>
                
            </Card.Content>
        </Card>
    );
};

export default CardInternal;
