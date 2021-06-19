import { action, observable, makeObservable, runInAction, toJS } from "mobx";

//LIBS
import DefaultStore from "../DefaultStore";
import KeyboardSettingFront from "../helpers/fronts/KeyboardSettingFront";
import keys, { getKeyByText } from "../helpers/keys";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "../helpers/errors/StoreError";
import ResponseError from "../helpers/errors/ResponseError";

//INTERFACES
import { SettingsStoreInterface } from "../interfaces";
import {
    KeyboardSettingFrontInterface,
    KeyboardData
} from "../helpers/fronts/KeyboardSettingFront";

type funcString =
    | "strike"
    | "super"
    | "sub"
    | "align"
    | "header1"
    | "header2"
    | "codeBlock"
    | "removeFormat";

type keyboardResponse = {
    key: number;
    shortKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
};

type keyboardSettingFront = {
    func: string;
    keyData: KeyboardSettingFront;
};

type keyboardSettingRaw = {
    func: funcString;
    keyData: keyboardResponse;
};

type keyString = keyof typeof keys;

const functionNames: string[] = [
    "Strikethrough",
    "Superscript",
    "Subscript",
    "Align",
    "Header 1",
    "Header 2",
    "Code-block",
    "Remove Format"
];
const formattedNames: funcString[] = [
    "strike",
    "super",
    "sub",
    "align",
    "header1",
    "header2",
    "codeBlock",
    "removeFormat"
];

class SettingsStore extends DefaultStore implements SettingsStoreInterface {
    keyboardSettings: keyboardSettingFront[];
    keyboardSettingsLoaded: boolean;
    newKeyboardSettingsQueue: keyboardSettingRaw[];
    rawKeyboardSettings: keyboardSettingRaw[];
    toQueueKeyboard: boolean;

    constructor() {
        super();
        this.keyboardSettings = [];
        this.rawKeyboardSettings = [];
        this.keyboardSettingsLoaded = false;
        this.newKeyboardSettingsQueue = [];
        this.toQueueKeyboard = false;

        makeObservable(this, {
            keyboardSettingsLoaded: observable,
            toQueueKeyboard: observable,
            addKeyDataToNewQueue: action,
            queueAllKeyboardSettings: action,
            newKeyboard: action
        });
        this._listenKeyboardSettings();
    }

    _listenKeyboardSettings() {
        ipcRenderer.on(
            "keyboardSettings:response",
            (event: object, args: keyboardResponse[]) => {
                try {
                    if (!Array.isArray(args))
                        throw new ResponseError(
                            "Invalid response from keyboardSettings:response"
                        );

                    const temp: KeyboardSettingFrontInterface[] = [];
                    args.forEach((item: KeyboardData) => {
                        temp.push(new KeyboardSettingFront(item));
                    });

                    runInAction(() => {
                        this.keyboardSettings = temp.map(
                            (item: KeyboardSettingFront, i: number) => {
                                return {
                                    keyData: item,
                                    func: functionNames[i]
                                };
                            }
                        );
                        this.rawKeyboardSettings = args.map(
                            (item: keyboardResponse, i: number) => {
                                return {
                                    keyData: item,
                                    func: formattedNames[i]
                                };
                            }
                        );
                        this.keyboardSettingsLoaded = true;
                        this.toQueueKeyboard = false;
                    });
                } catch (e) {
                    this._handleError(e);
                }
            }
        );
    }
    /** Sends request to get keyboard */
    public getKeyboard() {
        try {
            ipcRenderer.send("keyboardSettings");
        } catch (e) {
            this._handleError(e);
        }
    }

    /** Send new keyboard data */
    public newKeyboard() {
        try {
            if (this.newKeyboardSettingsQueue.length !== 8)
                throw new StoreError("Could not save all keys, try again!");

            console.log(this.newKeyboardSettingsQueue);

            const newKeyboardSettingsQueueArray = toJS(
                this.newKeyboardSettingsQueue
            );

            console.log(newKeyboardSettingsQueueArray);

            ipcRenderer.send("newKeyboardData", newKeyboardSettingsQueueArray);
            this.newKeyboardSettingsQueue = []; //empty queue for requeue;
            this.toQueueKeyboard = false;
        } catch (e) {
            console.log(e);
            this._handleError(e);
        }
    }
    /**
     * Fixes the invisible character issue with plus
     */
    private betterSplit(keyData: keyString) {
        if (keyData.split("").pop() === "+")
            return keyData.split("+").push("+");
        else return keyData.split("+");
    }

    /**  Adds keys to the new key queue, once queue is full, will send an event to update the keyboard settings*/
    public addKeyDataToNewQueue(keyData: keyString, func: funcString) {
        const args: keyString[] = this.betterSplit(keyData) as keyString[];

        args.forEach((item: string) => {
            try {
                if (
                    item.length > 1 &&
                    !["ALT", "CTRL", "SHIFT", "ESC"].includes(item)
                )
                    throw new StoreError(
                        `Invalid command '${item}', if you are on a mac and want to use the command button, just put CTRL instead.`
                    );
            } catch (e) {
                console.log(e);
                this._handleError(e);
            }
        });

        const formattedName = formattedNames[functionNames.indexOf(func)];

        if (args[args.length - 1] === "+")
            console.log("+", getKeyByText(args[args.length - 1]));

        this.newKeyboardSettingsQueue.push({
            func: formattedName,
            keyData: {
                key: getKeyByText(args[args.length - 1]),
                shortKey: args.includes("CTRL"),
                shiftKey: args.includes("SHIFT")
            }
        });

        if (this.newKeyboardSettingsQueue.length === 8) this.newKeyboard();
    }

    public queueAllKeyboardSettings() {
        this.toQueueKeyboard = true;
    }
}

export default SettingsStore;
export { keyboardSettingRaw, keyboardSettingFront };
