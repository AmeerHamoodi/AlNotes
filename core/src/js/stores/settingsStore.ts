import { action, observable, makeObservable, runInAction, toJS } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
import KeyboardSettingFront from "./helpers/fronts/KeyboardSettingFront";
import keys, { getKeyByText } from "./helpers/keys";
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

type keyString = keyof typeof keys;

const functionNames: string[] = ["Strikethrough", "Superscript", "Subscript", "Align", "Header 1", "Header 2", "Code-block"];
const formattedNames: string[] = ["strike", "super", "sub", "align", "header1", "header2", "codeBlock"];

class SettingsStore extends DefaultStore implements SettingsStoreInterface {
    keyboardSettings: keyboardSetting[];
    keyboardSettingsLoaded: boolean;
    newKeyboardSettingsQueue: newKeyboardSettings[];
    toQueueKeyboard: boolean;

    constructor() {
        super();
        this.keyboardSettings = [];
        this.keyboardSettingsLoaded = false;
        this.newKeyboardSettingsQueue = [];
        this.toQueueKeyboard = false;

        makeObservable(this, {
            keyboardSettings: observable,
            keyboardSettingsLoaded: observable,
            toQueueKeyboard: observable,
            addKeyDataToNewQueue: action,
            queueAllKeyboardSettings: action,
            newKeyboard: action

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
                    this.toQueueKeyboard = false;
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
            if(this.newKeyboardSettingsQueue.length !== 7) throw new StoreError("Could not save all keys, try again!");

            console.log(this.newKeyboardSettingsQueue);

            const newKeyboardSettingsQueueArray = toJS(this.newKeyboardSettingsQueue);

            console.log(newKeyboardSettingsQueueArray);

            ipcRenderer.send("newKeyboardData", newKeyboardSettingsQueueArray);
            this.newKeyboardSettingsQueue = []; //empty queue for requeue;

        } catch(e) {
            console.log(e);
            this._handleError(e);
        }
    }
    /**  Adds keys to the new key queue, once queue is full, will send an event to update the keyboard settings*/
    public addKeyDataToNewQueue(keyData: keyString, func: string) {
        const args: keyString[] = keyData.split("+") as keyString[];

        args.forEach((item: string) => {
            try {
                if(item.length > 1 && !["ALT", "CTRL", "SHIFT"].includes(item)) throw new StoreError(`Invalid command '${item}', if you are on a mac and want to use the command button, just put CTRL instead.`)
            } catch(e) {
                console.log(e);
                this._handleError(e);
            }
        });

        const formattedName = formattedNames[functionNames.indexOf(func)];

        this.newKeyboardSettingsQueue.push({
            func: formattedName,
            keyData: {
                key: getKeyByText(args[args.length - 1]),
                shortKey: args.includes("CTRL"),
                shiftKey: args.includes("SHIFT"),

            }
        });

        if(this.newKeyboardSettingsQueue.length >= 7) this.newKeyboard();
    }

    public queueAllKeyboardSettings() {
        this.toQueueKeyboard = true;
    }
};

export default SettingsStore;
export { keyboardSetting };