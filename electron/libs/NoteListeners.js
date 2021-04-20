class Listeners {
    constructor(ipcMain, mainWindow, storage, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.storage = storage;
        this.settings = settings;
        this.saveCalled = false;
    }
    setAll() {
        this.setSaveFileListener();
        this.setDeleteListener();
        this.setGetFileListeners();
        this.setSaveDataListeners();
        this.getSettings();
        this.setUpdateSettingsListeners();
    }
    setSaveDataListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("saveData", (err, args) => {
            if (typeof storage.getNoteById(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id) == "object") {
                storage.updateNote(args.id, args.name, args.content, args.className.toLowerCase(), args.unitName.toLowerCase());
            }
            this.saveCalled = false;
        });

        ipcMain.on("newNote", (ev, args) => {
            console.log("new", args);
            let id = storage.newNote(args.name, "", args.className.toLowerCase(), args.unitName.toLowerCase());
            mainWindow.send("id", id);
        })
    }
    setGetFileListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.once("getNotes", (ev, args) => {
            console.log(args.className.toLowerCase());
            mainWindow.webContents.send("notes", storage.getNotes(args.className.toLowerCase()));
        });

        let id = "";
        ipcMain.on("getNoteById", (event, args) => {
            if (id !== args.id) {
                id = args.id;
                console.log(args);
                let result = storage.getNoteById(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id);
                mainWindow.webContents.send("notesByName", result);
                mainWindow.send("id", id);
            }
        });

        ipcMain.on("reset", () => {
            console.log("reset");
            id = "";
        })
    }
    getSettings() {
        const ipcMain = this.ipcMain;
        const settings = this.settings;
        const mainWindow = this.mainWindow;

        ipcMain.on("getKeyboard", () => {
            const keyboard = settings.keyboard();

            mainWindow.send("keyboard", keyboard);
        })
    }
    setUpdateSettingsListeners() {
        const ipcMain = this.ipcMain;
        const settings = this.settings;

        ipcMain.on("updateKeyboard", (eve, args) => {
            settings.updateKeyboard(args);
        })
    }
    setSaveFileListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("save", (err, args) => {
            this.saveCalled = true;
            mainWindow.webContents.send("getSave");
        });

        ipcMain.on("saveData", (err, args) => {
            console.log(args.unitName);
            storage.updateNote(args.id, args.name, args.content, args.className.toLowerCase(), args.unitName.toLowerCase());
        })
    }
    setDeleteListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("deleteNote", (evem, args) => {
            storage.deleteNote(args.className.toLowerCase(), args.unitName.toLowerCase(), args.id);
            mainWindow.webContents.send("notes", storage.getNotes(args.className.toLowerCase(), args.unitName.toLowerCase()));
        })
    }
};

module.exports = Listeners;