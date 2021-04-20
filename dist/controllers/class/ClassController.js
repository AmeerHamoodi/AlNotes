module.exports = class ClassController {

    constructor(mainWindow, ipcMain, storage, settings) {
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

            ipcMain.on("getAllClasses", () => {
                mainWindow.webContents.send("allClasses", storage.getClasses());
            });
        }
        /**
         * Sets listeners for the newClass event and creates a new class according to the arguments sent.
         */

    _newClass() {
            const ipcMain = this.ipcMain;
            const storage = this.storage;

            ipcMain.on("newClass", (eve, args) => {
                storage.createClass(args);
                storage.saveAll();
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
                storage.deleteClass(args.className);
            })
        }
        /**
         * Listens to all unit events.
         */
        //TODO: REFACTOR THIS LOL
    _unitListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getAllUnits", (eve, args) => {
            const results = storage.getAllUnits(args);
            mainWindow.webContents.send("allUnits", results);
        });
        let unit = "";

        ipcMain.on("getUnit", (eve, args) => {
            if (unit !== args.unitName) {
                const results = storage.getUnit(args.className, args.unitName);

                mainWindow.webContents.send("unit", results);
                unit = args.unitName;
            }

        });

        ipcMain.on("resetUnit", (eve, args) => {
            unit = "";
        })

        ipcMain.on("newUnit", (eve, args) => {
            storage.newUnit(args.className, args.unitName);
            mainWindow.webContents.send("itemCreationCompleted");
        });
    }
}