import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Item, Image, Icon, Button } from "semantic-ui-react";

interface ListItemProps {
    name: string;
    link: string;
    deleteFunction?: () => void;
    icon?: "folder" | "book" | "flask" | "users";
}

const ListItem = ({ name, link, deleteFunction, icon }: ListItemProps) => {
    const history = useHistory();
    const internalDelete = () => {
        if (
            typeof deleteFunction === "function" &&
            confirm(
                "Are you sure you want to delete this item? It's irrverisible"
            )
        )
            deleteFunction();
    };

    const internalOpen = (linkDetails:string) => {
        if(!linkDetails.includes("//")) return history.push(linkDetails);

        const a = document.createElement("a");
        a.href = linkDetails;
        a.target = "_blank";

        a.click();
    };

    return (
        <Item>
            <Image size="tiny">
                <Icon name={icon || "book"} size="big"></Icon>
            </Image>
            <Item.Content verticalAlign="middle">
                <Item.Header as={Link} to={link || "/404"}>
                    {name || ""}
                </Item.Header>
            </Item.Content>
            <Item.Content style={{ marginRight: "3em" }}>
                <Button
                    negative
                    className="right floated"
                    onClick={internalDelete}
                >
                    <Icon name="trash"></Icon>
                    Delete
                </Button>
                <Button
                    primary
                    className="right floated"
                    onClick={() => internalOpen(link || "/404")}
                >
                    <Icon name="plus"></Icon>
                    Open
                </Button>
            </Item.Content>
        </Item>
    );
};

export default ListItem;
