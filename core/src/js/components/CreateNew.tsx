import React from "react";

interface CreateNewProps {
    title: string,
    onClick: any,
    creationText: string,
    children: any
}

const CreateNew = (props: CreateNewProps) => {
    return (
        <div className="ui basic segment mt mb">
            <div className="ui icon header" style={{ textAlign: "center" }}>
                {props.title}
            </div>
            <div className="inline">
                <div className="ui form">{props.children}</div>
                <div
                    className="ui button primary"
                    style={{ marginTop: "1em" }}
                    onClick={props.onClick}
                >
                    {props.creationText}
                </div>
            </div>
        </div>
    );
};

export default CreateNew;
