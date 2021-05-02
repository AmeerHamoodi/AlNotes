class SettingsController {
    constructor(ipcMain, mainWindow, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.settings = settings;
    }

    setAll() {
        this._listenForKeyboard();
    }

    _listenForKeyboard() {
        const ipcMain = this.ipcMain;
        const mainWindow = this.mainWindow;

        ipcMain.on("keyboardSettings", (event, args) => {
            console.log("got", JSON.stringify(this.settings.keyboard()));
            mainWindow.webContents.send("keyboardSettings:response", this.settings.keyboard());
        });
    }
};

module.exports = SettingsController;