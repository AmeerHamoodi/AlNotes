const Store = require('electron-store');

const store = new Store();

class UserSettings {
    constructor() {
        this.settings = null;
        this._init();
    }
    _init() {
        const settings = typeof store.get("userSettings") == "undefined" ? undefined : JSON.parse(store.get("userSettings"));

        if (typeof settings == "undefined" || !settings.hasOwnProperty("sizeSettings") || !settings.hasOwnProperty("keyboardSettings") | true) {
            this.settings = {
                keyboardSettings: {
                    strike: {
                        key: 83,
                        shiftKey: true,
                        shortKey: true
                    },
                    superScript: {
                        key: 187,
                        shiftKey: true,
                        shortKey: true
                    },
                    subScript: {
                        key: 189,
                        shiftKey: true,
                        shortKey: true
                    },
                    align: {
                        key: 65,
                        shiftKey: true,
                        shortKey: true
                    },
                    header1: {
                        key: 72,
                        shortKey: true
                    },
                    header2: {
                        key: 72,
                        shortKey: true,
                        shiftKey: true
                    },
                    codeBlock: {
                        key: 81,
                        shortKey: true,
                        shiftKey: true
                    }
                },
                sizeSettings: {
                    width: 1800,
                    height: 1020
                }
            };
            store.set("userSettings", JSON.stringify(this.settings));
        } else {
            this.settings = JSON.parse(store.get("userSettings"));
        }
    }
    get size() {
        return this.settings.sizeSettings;
    }
    updateKeyboard(newKeyboard) {
        this.settings.keyboardSettings = newKeyboard;
        store.set("userSettings", JSON.stringify(this.settings));
    }
    keyboard() {
        return Object.values(this.settings.keyboardSettings);
    }
    updateSize(newSize) {
        this.settings.sizeSettings = newSize;
        store.set("userSettings", JSON.stringify(this.settings));
    }
}

module.exports = UserSettings;