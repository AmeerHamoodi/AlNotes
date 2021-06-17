import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import Navbar from "../components/Navbar";
import Error from "../components/Error";
import Display from "../components/settings/Display";
import { Container, Button } from "semantic-ui-react";

//STORES
import SettingsStore, {
    keyboardSettingFront
} from "../stores/settingsPage/SettingsStore";

//INTERFACES
import { SettingsStoreInterface } from "../stores/interfaces";

const settingsStore: SettingsStoreInterface = new SettingsStore();

const Settings = observer(() => {
    useEffect(() => {
        settingsStore.getKeyboard();
    }, []);

    const data = settingsStore.keyboardSettingsLoaded
        ? settingsStore.keyboardSettings.map((item: keyboardSettingFront) => {
              return (
                  <Display
                      name={item.func}
                      keyCode={item.keyData.keyData}
                      key={`display_${Math.random()}`}
                      store={settingsStore}
                  />
              );
          })
        : [];

    const saveKeyboard = () => {
        settingsStore.queueAllKeyboardSettings();
    };

    return (
        <>
            <Navbar backLink="/" username="Development"></Navbar>
            <Container className="mt">
                <h1 style={{ textAlign: "center" }}>Settings:</h1>
                <h3 style={{ textAlign: "center" }}>Keyboard Settings:</h3>
                <div className="items ms5">{data}</div>
                <Button primary onClick={saveKeyboard}>
                    Save keyboard settings
                </Button>
                <Error
                    toShow={settingsStore.errorContent.occured}
                    textToShow={settingsStore.errorContent.data}
                ></Error>
            </Container>
        </>
    );
});

export default Settings;
