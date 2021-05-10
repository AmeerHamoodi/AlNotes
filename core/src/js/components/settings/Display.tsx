import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import { Grid, Form } from "semantic-ui-react";

import { SettingsStoreInterface } from "../../stores/interfaces";

type props = {
    name: string;
    keyCode: string;
    store: SettingsStoreInterface;
};

const Display = observer(({ name, keyCode, store }: props) => {
    const [keyCodeValue, setKeyCodeValue] = useState(keyCode);

    const { toQueueKeyboard } = store;

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        const target = e.target as HTMLInputElement;
        setKeyCodeValue(target.value);
        disposer();
    };

    const disposer = autorun(() => {
        if (toQueueKeyboard) store.addKeyDataToNewQueue(keyCodeValue, name);
    });

    return (
        <Grid
            className="item"
            style={{ alignItems: "center", justifyContent: "center" }}
        >
            <Grid.Row columns="two">
                <Grid.Column>
                    <b style={{ marginRight: "2em" }}>{name}:</b>
                    <b>{keyCode}</b>
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                type="text"
                                placeholder="Type the 'meta keys' (like CTRL, ALT, SHIFT ...) and key involved in your shortkey"
                                value={keyCodeValue}
                                onChange={handleChange}
                            ></Form.Input>
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
});

export default Display;
