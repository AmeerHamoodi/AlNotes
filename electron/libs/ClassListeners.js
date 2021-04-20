class ClassListeners {
    constructor(ipcMain, mainWindow, storage, settings) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.storage = storage;
        this.settings = settings;
    }
    setAll() {
        this.setGetClassesListener();
        this.setNewClassListener();
        this.setGetClassListener();
        this.setNewClassItemListeners();
        this.setDeleteClassItemListener();
        this.deleteClassListener();
        this.setUnitListeners();
        this.formulaSheetListener();
    }
    setGetClassesListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getAllClasses", () => {
            mainWindow.send("allClasses", storage.getClasses());
        });
    }
    setNewClassListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("newClass", (eve, args) => {
            storage.createClass(args);
            storage.saveAll();
        })
    }
    setGetClassListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getClassContent", (eve, args) => {
            const result = storage.getClassByName(args);
            mainWindow.send("classContent", result);
        })
    }
    setNewClassItemListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("createTextbook", (ev, args) => {
            console.log(args);
            storage.addTextbook(args.className, args.data)
            mainWindow.send("itemCreationCompleted");
        })
        ipcMain.on("createLab", (ev, args) => {
            storage.addLab(args.className, args.data)
            mainWindow.send("itemCreationCompleted");
        })
        ipcMain.on("createMeeting", (ev, args) => {
            storage.addMeeting(args.className, args.data)
            mainWindow.send("itemCreationCompleted");
        })
    }
    setDeleteClassItemListener() {
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
    deleteClassListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;

        ipcMain.on("deleteClass", (ev, args) => {
            storage.deleteClass(args.className);
        })
    }
    setUnitListeners() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        ipcMain.on("getAllUnits", (eve, args) => {
            const results = storage.getAllUnits(args);
            mainWindow.send("allUnits", results);
        });
        let unit = "";

        ipcMain.on("getUnit", (eve, args) => {
            if (unit !== args.unitName) {
                const results = storage.getUnit(args.className, args.unitName);

                mainWindow.send("unit", results);
                unit = args.unitName;
            }

        });

        ipcMain.on("resetUnit", (eve, args) => {
            unit = "";
        })

        ipcMain.on("newUnit", (eve, args) => {
            storage.newUnit(args.className, args.unitName);
            mainWindow.send("itemCreationCompleted");
        });
    }
    formulaSheetListener() {
        const ipcMain = this.ipcMain;
        const storage = this.storage;
        const mainWindow = this.mainWindow;

        let className = "";

        ipcMain.on("client_setFormulaSheet", (eve, data) => {
            mainWindow.send("client_formulaData", args);
        });

        ipcMain.on("setFormulaSheet", (ev, args) => {
            storage.updateFormulaSheet(args.name, args.content);
        });

        ipcMain.on("getFormulaSheet", (ev, args) => {
            if (className !== args) {
                className = args;
                mainWindow.send("formulaSheet", storage.getFormulaSheet(args));
            }
        });

        ipcMain.on("resetClassName", () => {
            console.log("resetClassName")
            className = "";
        })
    }
}

module.exports = ClassListeners;