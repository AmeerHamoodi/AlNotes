import React from "react";
import { Segment, Header, Form, Button } from "semantic-ui-react";

interface CreateNewProps {
    title: string;
    onClick: any;
    creationText: string;
    children: any;
}

const CreateNew = (props: CreateNewProps) => {
    return (
        <Segment className="mt mb" basic>
            <Header icon style={{ textAlign: "center" }}>
                {props.title}
            </Header>
            <Segment.Inline>
                <Form>{props.children}</Form>
                <Button
                    primary
                    style={{ marginTop: "1em" }}
                    onClick={props.onClick}
                    id="createNew"
                >
                    {props.creationText}
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default CreateNew;
