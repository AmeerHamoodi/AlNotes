import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Grid } from "semantic-ui-react";

interface CardPropsInterface {
    name?: string;
    openMessage?: string;
    deleteMessage?: string;
    link?: string;
    deleteFunction?: () => void;
    archived?: boolean;
    archiveFunction?: () => void;
}

const CardInternal = ({
    name,
    openMessage,
    deleteMessage,
    link,
    deleteFunction,
    archived,
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
            confirm(`Are you sure you want to ${!archived ? "archive" : "unarchive"} this`)
        )
            archiveFunction();
    };

    return (
        <Card className="mt">
            <Card.Content>
                <Card.Header>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3} floated="left">
                            <Link to={link || "/404"}>{name || "No name"}</Link>
                            </Grid.Column>
                            <Grid.Column width={9} floated="right">
                                <Button.Group floated="right">
                                    <Button primary as={Link} to={link || "/404"} icon="add" />
                                    <Button negative onClick={deleteInternal} icon="trash alternate" />
                                    {typeof archiveFunction == "function" ? (
                                        <Button
                                            color="yellow"
                                            onClick={archiveInternal}
                                            icon={!archived ? "archive" : "eye"}
                                        />
                                    ) : null}
                                </Button.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Header>
            </Card.Content>
        </Card>
    );
};

export default CardInternal;
