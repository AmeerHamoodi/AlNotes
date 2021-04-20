class NotesController {
    constructor(ipcMain, mainWindow, storage, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.storage = storage;
        this.settings = settings;
        this.saveCalled = false;
    }
    setAll() {
        this._saveData();
        this._deleteNote();
        this._getNotes();
        this._getSettings();
        this._saveNote();
    }
    _saveData() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("saveData", (event, args) => {
            if (typeof storage.getNoteById(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id) == "object") {
                storage.updateNote(args.id, args.name, args.content, args.className.toLowerCase(), args.unitName.toLowerCase());
            }
            this.saveCalled = false;
        });

        ipcMain.on("newNote", (event, args) => {
            mainWindow.send("id", storage.newNote(args.name, "", args.className.toLowerCase(), args.unitName.toLowerCase()));
        })
    }
    _getNotes() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.once("getNotes", (event, args) => {
            mainWindow.webContents.send("notes", storage.getNotes(args.className.toLowerCase()));
        });

        ipcMain.on("getNoteById", (event, args) => {
            mainWindow.webContents.send("notesByName", storage.getNoteById(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id));
        });

    }
    _getSettings() {
            const ipcMain = this.ipcMain;
            const settings = this.settings;
            const mainWindow = this.mainWindow;

            ipcMain.on("getKeyboard", () => {
                const keyboard = settings.keyboard();

                mainWindow.send("keyboard", keyboard);
            })
        }
        //TODO: Refactor this, need to see how I'm gonna do the front-end first
    _saveNote() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("save", () => {
            this.saveCalled = true;
            mainWindow.webContents.send("getSave");
        });

        ipcMain.on("saveData", (err, args) => {
            console.log(args.unitName);
            storage.updateNote(args.id, args.name, args.content, args.className.toLowerCase(), args.unitName.toLowerCase());
        })
    }
    _deleteNote() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("deleteNote", (evem, args) => {
            storage.deleteNote(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id);
            mainWindow.webContents.send("notes", storage.getNotes(args.className.toLowerCase(), args.unitName.toLowerCase()));
        })
    }
};

module.exports = NotesController;