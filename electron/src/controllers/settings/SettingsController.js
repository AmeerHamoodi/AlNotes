class SettingsController {
    constructor(ipcMain, mainWindow, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.settings = settings;
    }
    /**
     * Sets all of the listeners
     */
    setAll() {
        this._listenForKeyboard();
    }

    /** Private method that listens for all keyboard calls */
    _listenForKeyboard() {
        const ipcMain = this.ipcMain;
        const mainWindow = this.mainWindow;

        ipcMain.on("keyboardSettings", (event, args) => {
            mainWindow.webContents.send("keyboardSettings:response", this.settings.keyboard());
        });

        //New keyboard settings
        ipcMain.on("newKeyboardData", (event, args) => {
            console.log("got new keybaord", JSON.stringify(args));
            const keyboard = {};
            args.forEach(item => {
                keyboard[item.func] = item.keyData;
            });

            this.settings.updateKeyboard(keyboard);
            mainWindow.webContents.send("keyboardSettings:response", this.settings.keyboard());
        })
    }
};

module.exports = SettingsController;