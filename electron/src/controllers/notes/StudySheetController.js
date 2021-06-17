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
        this.mainWindow.webContents.send("studySheetThread:error", {
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

            const data = storage.getClassStudySheet(data.className);
            if (!data)
                return this._errorClient(
                    "An error with the study sheet model occurred!"
                );

            mainWindow.webContents.send("fetchStudySheet:response", data);
        });
    }
}

module.exports = StudySheetController;
