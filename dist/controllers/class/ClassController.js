module.exports = class ClassController {

    constructor(ipcMain, mainWindow, storage, settings) {
        this.mainWindow = mainWindow;
        this.ipcMain = ipcMain;
        this.storage = storage;
        this.settings = settings;
    }
    setAll() {
        this._getClasses();
        this._deleteClass();
        this._deleteClassItem();
        this._getClass();
        this._newClass();
        this._newClassItem();
        this._unitListeners();
    }
    /**
     * Sets listerns for the getAllClasses events and sends back all of the classes;
     */
    _getClasses() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        console.log("Listening");

        ipcMain.on("getAllClasses", () => {
            mainWindow.webContents.send("getAllClasses:response", storage.getClasses());
        });
    }
    /**
     * Sets listeners for the newClass event and creates a new class according to the arguments sent.
     */

    _newClass() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;

        ipcMain.on("newClass", (eve, args) => {
            if (storage.createClass(args) === false) return this.mainWindow.webContents.send("classThread:error", `Class ${args} already exists`);
            storage.saveAll();

            this.mainWindow.webContents.send("getAllClasses:response", storage.getClasses());
        })
    }
    /**
     * Listens for getClassContent event, which returns the specific class's content.
     */
    _getClass() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getClassContent", (eve, args) => {
            const result = storage.getClassByName(args);
            mainWindow.webContents.send("classContent", result);
        })
    }
    /**
     * Listens for all of the events regarding to the creation of class content.
     */
    _newClassItem() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("createTextbook", (ev, args) => {
            console.log(args);
            storage.addTextbook(args.className, args.data)
            mainWindow.webContents.send("itemCreationCompleted");
        })
        ipcMain.on("createLab", (ev, args) => {
            storage.addLab(args.className, args.data)
            mainWindow.webContents.send("itemCreationCompleted");
        })
        ipcMain.on("createMeeting", (ev, args) => {
            storage.addMeeting(args.className, args.data)
            mainWindow.webContents.send("itemCreationCompleted");
        })
    }
    /**
     * Listens to events regarding deletion of class content.
     */
    _deleteClassItem() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;

        ipcMain.on("deleteItem", (ev, args) => {
            switch (args.type) {
                case "textbook":
                    storage.deleteTextbook(args.className, args.name);
                    break;
                case "lab":
                    storage.deleteLab(args.className, args.name);
                    break;
                case "meeting":
                    storage.deleteMeeting(args.className, args.name);
                    break;
                case "unit":
                    storage.deleteUnit(args.className, args.name);
                    break;
            }
        })

    }
    /**
     * Listens to events regarding deletion of a class.
     */
    _deleteClass() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;

        ipcMain.on("deleteClass", (ev, args) => {
            if (storage.deleteClass(args) === false) return this.mainWindow.webContents.send("classThread:error", `Class ${args} doesn't exists`);

            this.mainWindow.webContents.send("getAllClasses:response", storage.getClasses());
        })
    }
    /**
     * Listens to all unit events.
     */
    _unitListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;

        ipcMain.on("getAllUnits", (eve, args) => {
            const allUnits = storage.getAllUnits(args);

            if (allUnits === false) return this.mainWindow.webContents.send("classThread:error", `Class ${args} doesn't exists`);

            this.mainWindow.webContents.send("getAllUnits:response", allUnits);
        });

        ipcMain.on("createNewUnit", (eve, args) => {
            if (!"unitName" in args || !"className" in args) return this.mainWindow.webContents.send("classThread:error", `Class and unit not included`);

            const result = storage.newUnit(args);
            if (result === false) return this.mainWindow.webContents.send("classThread:error", "Unit already exists");

            this.mainWindow.webContents.send("getAllUnits:response", storage.getAllUnits(args.className))
        });

        ipcMain.on("deleteUnit", (eve, args) => {
            if (!"unitName" in args || !"className" in args) return this.mainWindow.webContents.send("classThread:error", `Class or unit are not included`);

            if (storage.deleteUnit(args.className, args.unitName) === false) return this.mainWindow.webContents.send("classThread:error", "Unit or class does not exist");

            this.mainWindow.send("getAllUnits:response", storage.getAllUnits(args.className));
        });
    }
}