class NotesController {
    constructor(ipcMain, mainWindow, storage, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.storage = storage;
        this.settings = settings;
        this.saveCalled = false;
    }
    /**
     * Sets all listeners
     */
    setAll() {
        this._saveData();
        this._deleteNote();
        this._getNotes();
        //this._getSettings();
        this._saveNote();
    }
    /**
     * Listens to any save related events
     */
    _saveData() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("saveData", (event, args) => {
            if (
                typeof storage.getNoteById(
                    args.className.toLowerCase(),
                    args.unitName.toLowerCase(),
                    args.id
                ) == "object"
            ) {
                storage.updateNote(
                    args.id,
                    args.name,
                    args.content,
                    args.className.toLowerCase(),
                    args.unitName.toLowerCase()
                );
            }
            this.saveCalled = false;
        });

        ipcMain.on("newNote", (event, args) => {
            const response = storage.newNote(
                args.noteName || "New Note",
                "",
                args.className.toLowerCase(),
                args.unitName.toLowerCase()
            );
            if (response === false)
                return mainWindow.webContents.send(
                    "classThread:error",
                    "Unit or class does not exist"
                );

            mainWindow.webContents.send(
                "getNotes:response",
                storage.getNotes(args.className, args.unitName)
            );
        });
    }
    /**
     * Listens for any get based events
     */
    _getNotes() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getNotes", (event, args) => {
            const response = storage.getNotes(
                args.className.toLowerCase(),
                args.unitName.toLowerCase()
            );

            if (response === false)
                return mainWindow.webContents.send(
                    "classThread:error",
                    "Unit or class does not exist"
                );

            mainWindow.webContents.send("getNotes:response", response);
        });

        ipcMain.on("getNoteById", (event, args) => {
            const response = storage.getNoteById(
                args.className.toLowerCase(),
                args.unitName.toLowerCase(),
                args.id
            );

            //console.log(response)

            if (response === false)
                return mainWindow.webContents.send(
                    "classThread:error",
                    "Error getting note"
                );

            mainWindow.webContents.send("getNoteById:response", response);
        });
    }

    /**
     * Listens to all events related to saving the note
     */
    _saveNote() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("saveData", (err, args) => {
            const response = storage.updateNote(
                args.id,
                args.name,
                args.content,
                args.className.toLowerCase(),
                args.unitName.toLowerCase()
            );

            if (response === false)
                return mainWindow.send(
                    "classThread:error",
                    "Note does not exist!"
                );
        });
    }
    /**
     * Listens to delete note event
     */
    _deleteNote() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("deleteNote", (evem, args) => {
            const response = storage.deleteNote(
                args.className.toLowerCase(),
                args.unitName.toLowerCase(),
                args.id
            );

            if (response === false)
                return mainWindow.webContents.send(
                    "classThread:error",
                    "Could not delete the note"
                );

            mainWindow.webContents.send(
                "getNotes:response",
                storage.getNotes(
                    args.className.toLowerCase(),
                    args.unitName.toLowerCase()
                )
            );
        });
    }
}

module.exports = NotesController;
