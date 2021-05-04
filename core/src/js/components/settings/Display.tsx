import React, { useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";

import { SettingsStoreInterface } from "../../stores/interfaces";

type props = {
    name: string,
    keyCode: string,
    store: SettingsStoreInterface
}

const Display = observer(({ name, keyCode, store }: props) => {
    const [keyCodeValue, setKeyCodeValue] = useState(keyCode);

    const { toQueueKeyboard } = store;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setKeyCodeValue(target.value);
        disposer();
        console.log("change...");
    };

    const disposer = autorun(() => {
        console.log(keyCodeValue);
        if(toQueueKeyboard) store.addKeyDataToNewQueue(keyCodeValue, name);
    })

    return (
        <div className="ui item grid" style={{alignItems: "center", justifyContent:"center"}}>
            <div className="two column row">
                <div className="column">
                    <b style={{marginRight: "2em"}}>{name}:</b><b>{keyCode}</b>
                </div>
                <div className="column">
                    <div className="ui form">
                        <div className="field">
                            <input type="text" placeholder="Type the 'meta keys' (like CTRL, ALT, SHIFT ...) and key involved in your shortkey" 
                            value={keyCodeValue} onChange={handleChange} /*onKeyUp={handleChange} onKeyDown={handleChange} *//>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default Display;