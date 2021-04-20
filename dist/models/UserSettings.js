const Store = require('electron-store');

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
    get size() {
        return this.settings.sizeSettings;
    }
    updateKeyboard(newKeyboard) {
        this.settings.keyboardSettings = newKeyboard;
    }
    keyboard() {
        return this.settings.keyboardSettings;
    }
    updateSize(newSize) {
        this.settings.sizeSettings = newSize;
        store.set("userSettings", JSON.stringify(this.settings));
    }
}

module.exports = UserSettings;