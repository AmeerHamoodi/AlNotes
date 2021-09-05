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
                <Button primary as={Link} to={link || "/404"} attached="bottom">
                    <Icon name="add"></Icon>
                    {openMessage || "Open"}
                </Button>
                <Button negative onClick={deleteInternal} attached="bottom">
                    <Icon name="trash alternate"></Icon>
                    {deleteMessage || "Delete"}
                </Button>
                {typeof archiveInternal == "function" ? (
                    <Button
                        basic
                        color="yellow"
                        attached="bottom"
                        onClick={archiveInternal}
                    >
                        <Icon name="archive" />
                        Archive
                    </Button>
                ) : null}
            </Card.Content>
        </Card>
    );
};

export default CardInternal;
