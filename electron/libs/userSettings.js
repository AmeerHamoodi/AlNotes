const Store = require('electron-store');
const { dialog } = require("electron");

const store = new Store();

class UserSettings {
    constructor() {
        this.settings = null;
        this._init();
    }
    _init() {
        const settings = typeof store.get("userSettings") == "undefined" ? undefined : JSON.parse(store.get("userSettings"));

        if (typeof settings == "undefined" || !settings.hasOwnProperty("sizeSettings") || !settings.hasOwnProperty("keyboardSettings")) {
            this.settings = {
                keyboardSettings: {
                    strike: "CTRL+SHIFT+S",
                    superScript: "CTRL+O",
                    subScript: "CTRL+P",
                    center: "CTRL+SHIFT+E",
                    right: "CTRL+SHIFT+R",
                    left: "CTRL+SHIFT+L",
                    header1: "CTRL+H",
                    header2: "CTRL+SHIFT+H",
                    anki: "CTRL+SHIFT+A",
                    submitAnki: "CTRL+Q",
                    save: "CTRL+S",
                    codeBlock: "CTRL+SHIFT+B"
                },
                sizeSettings: {
                    width: 1800,
                    height: 1020
                }
            };
            store.set("userSettings", JSON.stringify(this.settings));
        } else {
            this.settings = JSON.parse(store.get("userSettings"));
            console.log(this.settings);
        }
    }
    setAnkiPath(path) {
        const formattedString = path.toString().replace(/\\/g, "/");

        if (fs.existsSync(formattedString)) {
            this.settings.ankiSettings.ankiPath = path;
        } else {
            dialog("The path to anki is incorrect");
        }
    }
    setStartAnki(value) {
        if (typeof value == "boolean") {
            this.settings.ankiSettings.startAnki = value;
        } else {
            dialog("Incorrect datatype for set anki value. Stop playing with the code please.");
        }
    }
    get size() {
        return this.settings.sizeSettings;
    }
    updateKeyboard(newKeyboard) {
        this.settings.keyboardSettings = newKeyboard;
    }
    keyboard() {
        console.log(this.settings.keyboardSettings);
        return this.settings.keyboardSettings;
    }
    updateSize(newSize) {
        this.settings.sizeSettings = newSize;
        console.log(this.settings);
        store.set("userSettings", JSON.stringify(this.settings));
    }
}

module.exports = UserSettings;