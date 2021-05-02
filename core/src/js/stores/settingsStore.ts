import { action, observable, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
import KeyboardSettingFront from "./helpers/fronts/KeyboardSettingFront";
import keys from "./helpers/keys";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "./helpers/errors/StoreError";
import ResponseError from "./helpers/errors/ResponseError";

//INTERFACES
import { SettingsStoreInterface } from "./interfaces";
import { KeyboardSettingFrontInterface, KeyboardData } from "./helpers/fronts/KeyboardSettingFront";

type keyboardResponse = {
    key: number,
    shortKey?: boolean,
    altKey?: boolean,
    shiftKey?: boolean
}

type keyboardSetting = {
    func: string,
    keyData: KeyboardSettingFront
}

type newKeyboardSettings = {
    func: string,
    keyData: keyboardResponse
}

const functionNames: string[] = ["Strikethrough", "Superscript", "Subscript", "Align", "Header 1", "Header 2", "Code-block"];
const formattedNames: string[] = ["strike", "super", "sub", "align", "header1", "header2", "codeBlock"];

class SettingsStore extends DefaultStore implements SettingsStoreInterface {
    keyboardSettings: keyboardSetting[];
    keyboardSettingsLoaded: boolean;
    newKeyboardSettings: newKeyboardSettings[];

    constructor() {
        super();
        this.keyboardSettings = [];
        this.keyboardSettingsLoaded = false;
        this.newKeyboardSettings = [];

        makeObservable(this, {
            keyboardSettings: observable,
            keyboardSettingsLoaded: observable,
            newKeyboardSettings: observable,
            setKeyboardReady: action
        });
        this._listenKeyboardSettings();
    }

    _listenKeyboardSettings() {
        ipcRenderer.on("keyboardSettings:response", (event: object, args: keyboardResponse[]) => {
            try {
                if(!Array.isArray(args)) throw new ResponseError("Invalid response from keyboardSettings:response");

                console.log("got");

                const temp: KeyboardSettingFrontInterface[] = [];
                args.forEach((item: KeyboardData) => {
                    temp.push(new KeyboardSettingFront(item));
                });

                runInAction(() => {
                    this.keyboardSettings = temp.map((item: KeyboardSettingFront, i: number) => {
                        return {
                            keyData: item,
                            func: functionNames[i]
                        }
                    });
                    this.keyboardSettingsLoaded = true;
                })

            } catch(e) {
                this._handleError(e);
            }
        })
    }
    /** Sends request to get keyboard */
    public getKeyboard() {
        try {
            ipcRenderer.send("keyboardSettings");
        } catch(e) {
            this._handleError(e);
        }
    }

    /** Send new keyboard data */
    public newKeyboard() {
        try {
            //if(!Array.from(this.newKeyboardReady).every((val) => val) || this.newKeyboardReady.length !== 7) throw new StoreError("Could not save all keys, try again!");

            ipcRenderer.send("newKeyboardData", )

        } catch(e) {

        }
    }

    public setKeyboardReady(keyData: string, func: string) {
        const args: string[] = keyData.split("+");
        args.forEach((item: string) => {
            if(item.length > 1 && !["ALT", "CTRL", "SHIFT"].includes(item)) throw new StoreError(`Invalid command '${item}', if you are on a mac and want to use the command button, just put CTRL instead.`)        
        });

        const formattedName = formattedNames[functionNames.indexOf(func)];

        this.newKeyboardSettings.push({
            func: formattedName,
            keyData: {
                key: keys[args[args.length - 1].toString()],
                shortKey: args.includes("CTRL"),
                shiftKey: args.includes("SHIFT"),

            }
        })
    }
};

export default SettingsStore;
export { keyboardSetting };