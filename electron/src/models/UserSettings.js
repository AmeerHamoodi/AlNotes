const Store = require('electron-store');

const store = new Store();

class UserSettings {
    constructor(override) {
        this.settings = null;
        this._init(override);
    }
    /**
     * Fetches and sets all settings objects
     */
    _init(override) {
        const settings = typeof store.get("userSettings") == "undefined" ? undefined : JSON.parse(store.get("userSettings"));

        if (typeof settings == "undefined" || !settings.hasOwnProperty("sizeSettings") || !settings.hasOwnProperty("keyboardSettings") || override) {
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
                    },
                    removeFormat: {
                        key: 27
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
    /**
     * Updates the keyboard settings i.e. shortkeys and their functions
     * @param {object} newKeyboard The new keyboard object
     */
    updateKeyboard(newKeyboard) {
        this.settings.keyboardSettings = newKeyboard;
        store.set("userSettings", JSON.stringify(this.settings));
    }
    /**
     * Informal getter that returns all of the keyboard items as an array
     * @returns {array} All of the keyboard settings
     */
    keyboard() {
        return Object.values(this.settings.keyboardSettings);
    }
    /**
     * Updates the screen size stored as a preferencee
     * @param {object} newSize Should contain an integer new width and height
     */
    updateSize(newSize) {
        this.settings.sizeSettings = newSize;
        store.set("userSettings", JSON.stringify(this.settings));
    }
}

module.exports = UserSettings;