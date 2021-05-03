import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import Navbar from "../components/Navbar";
import Error from "../components/Error";
import Display from "../components/settings/Display";

//STORES
import SettingsStore, { keyboardSetting } from "../stores/settingsStore";

//INTERFACES
import { SettingsStoreInterface } from "../stores/interfaces";

const settingsStore: SettingsStoreInterface = new SettingsStore();

const Settings = observer(() => {

    useEffect(() => {
        settingsStore.getKeyboard();
    }, [])

    const data = settingsStore.keyboardSettingsLoaded ? settingsStore.keyboardSettings.map((item: keyboardSetting) => {
        return <Display name={item.func} keyCode={item.keyData.keyData} key={`display_${Math.random()}`} store={settingsStore}/>
    }) : [];


    const saveKeyboard = () => {
        settingsStore.queueAllKeyboardSettings();
    };

    return (
        <>
            <Navbar backLink="/" username="Development"></Navbar>
            <h1 style={{textAlign: "center"}}>Settings:</h1>
            <h3 style={{textAlign: "center"}}>Keyboard Settings:</h3>
            <div className="items ms5">
                {data}
            </div>
            <div className="ui button primary" onClick={saveKeyboard}>Save keyboard settings</div>
            <Error toShow={settingsStore.errorContent.occured} textToShow={settingsStore.errorContent.data}></Error>
        </>
    )
});

export default Settings;