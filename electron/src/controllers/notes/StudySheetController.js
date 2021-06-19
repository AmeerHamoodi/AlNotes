class StudySheetController {
    constructor(ipcMain, mainWindow, storage, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.storage = storage;
        this.settings = settings;
    }
    /**
     * Registers all listeners
     */
    setAll() {
        this.getStudySheetListener();
    }

    _errorClient(message) {
        this.mainWindow.webContents.send("classThread:error", {
            message
        });
    }

    getStudySheetListener() {
        const ipcMain = this.ipcMain;
        const mainWindow = this.mainWindow;
        const storage = this.storage;

        ipcMain.on("fetchStudySheet", (event, data) => {
            if (typeof data.className !== "string")
                return this._errorClient("Class does not exist!");

            const responseData = storage.getClassStudySheet(
                data.className.toLowerCase()
            );

            if (!responseData)
                return this._errorClient(
                    "An error with the study sheet model occurred!"
                );

            mainWindow.webContents.send(
                "fetchStudySheet:response",
                responseData
            );
        });
    }
}

module.exports = StudySheetController;
