require("dotenv").config();
//LIBS
const { app, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const contextMenu = require("electron-context-menu");
const { autoUpdater } = require("electron-updater");
const localShortcut = require("electron-localshortcut");
const Store = require("electron-store");
const path = require("path");
const isDev = require("electron-is-dev");

//INTERNALS
const DataStorage = require("./models/DataStorage");
const UserSettings = require("./models/UserSettings");
const StudySheet = require("./models/studySheet");

const storage = new DataStorage();
const settings = new UserSettings(false);
const studySheet = new StudySheet();
studySheet._init();

const store = new Store();

// CONTROLLERS
const NotesController = require("./controllers/notes/NotesController");
const ClassController = require("./controllers/class/ClassController");
const SettingsController = require("./controllers/settings/SettingsController");
const StudySheetController = require("./controllers/notes/StudySheetController");

autoUpdater.logger = log;

if (isDev)
    require("electron-reload")(path.join(__dirname, "./electron/src/"), {
        electron: path.join(__dirname, "node_modules", ".bin", "electron")
    });

class Main {
    constructor() {
        this.mainWindow = null;
        this.loadingWindow = null;

        this._init();
    }
    /**
     * Calls all necessary methods for initialization
     */
    _init() {
        app.whenReady().then(() => {
            this.setLoadingWindow();
            this.setWindowMain();
        });
        this.beforeCloseFunctions();
    }
    /**
     * Sets all functions before closing window
     */
    beforeCloseFunctions() {
        app.once("before-quit", () => {
            storage.saveAll();
        });
        app.on("window-all-closed", () => {
            app.quit();
        });
    }
    /**
     * Creates and sets main browser window
     */
    setWindowMain() {
        this.mainWindow = new BrowserWindow({
            width: settings.size.width || 1800,
            height: settings.size.height || 1020,
            webPreferences: {
                nodeIntegration: true,
                spellcheck: true,
                enableRemoteModule: true,
                contextIsolation: false
            }
        });
        this.mainWindow.hide();

        this.mainWindow.webContents.once("dom-ready", () => {
            this.mainWindow.show();
            this.loadingWindow.close();
            this.showUpdateMessage();
            this.autoupdate();
            this.registerAutoShortcut();
            this.setSpellChecking();
        });

        this.mainWindow.loadURL(path.join(__dirname, "/public/index.html"));
        this.mainWindow.removeMenu();

        /**
         * Where the controllers get initialized
         */
        this.notesController = new NotesController(
            ipcMain,
            this.mainWindow,
            storage,
            settings
        );
        this.classController = new ClassController(
            ipcMain,
            this.mainWindow,
            storage,
            settings
        );
        this.settingsController = new SettingsController(
            ipcMain,
            this.mainWindow,
            settings
        );
        this.studySheetController = new StudySheetController(
            ipcMain,
            this.mainWindow,
            studySheet,
            settings
        );

        /**
         * Sets all of the controller listeners
         */
        this.notesController.setAll();
        this.classController.setAll();
        this.settingsController.setAll();
        this.studySheetController.setAll();

        this.mainWindow.on("close", () => {
            this.mainWindow.webContents.send("closing");
        });

        this.mainWindow.on("resize", () => {
            const size = this.mainWindow.getSize();
            settings.updateSize({ width: size[0], height: size[1] });
        });
        if (isDev) this.mainWindow.webContents.openDevTools();
    }

    /**
     * Loading window/splash screen method
     */
    setLoadingWindow() {
        this.loadingWindow = new BrowserWindow({
            width: 500,
            height: 300,
            frame: false
        });
        this.loadingWindow.loadURL(
            path.join(__dirname, "/public/loading.html")
        );
    }
    /**
     * Initializes the context menu method here
     */
    setSpellChecking() {
        contextMenu({ showInspectElement: false });
    }

    /**
     * Checks user storage and compares versions to see whether or not to show the update message or not
     */
    showUpdateMessage() {
        const currentVersion = store.get("version");

        if (typeof currentVersion == "undefined")
            store.set("version", app.getVersion());

        if (currentVersion !== app.getVersion()) {
            this.mainWindow.webContents.send("showJustUpdated");
            store.set("version", app.getVersion());
        }
    }
    /**
     * Checcks if there's an update and proceeds with the update
     */
    autoupdate() {
        const sendStatusToWindow = (message) => {
            this.mainWindow.webContents.send("updateMessage", message);
        };
        autoUpdater.checkForUpdatesAndNotify();

        autoUpdater.on("update-available", () => {
            this.mainWindow.webContents.send(
                "updateMessage",
                "Update available!"
            );
        });

        autoUpdater.on("update-downloaded", () => {
            autoUpdater.quitAndInstall();
        });

        autoUpdater.on("checking-for-update", () => {
            sendStatusToWindow("Checking for update...");
        });
        autoUpdater.on("update-available", (info) => {
            sendStatusToWindow("Update available.");
        });
        autoUpdater.on("update-not-available", (info) => {
            sendStatusToWindow("Update not available.");
        });
        autoUpdater.on("error", (err) => {
            sendStatusToWindow("Error in auto-updater. " + err);
        });
        autoUpdater.on("download-progress", (progressObj) => {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message =
                log_message + " - Downloaded " + progressObj.percent + "%";
            log_message =
                log_message +
                " (" +
                Math.round(progressObj.transferred) +
                "/" +
                Math.round(progressObj.total) +
                ")";
            sendStatusToWindow(log_message);
        });
        autoUpdater.on("update-downloaded", (info) => {
            sendStatusToWindow("Update downloaded");
        });
    }
    /**
     * Registers all functional localShortcuts
     */
    registerAutoShortcut() {
        localShortcut.register(this.mainWindow, "CommandOrControl+R", () => {
            this.mainWindow.reload();
        });
        localShortcut.register(this.mainWindow, "F12", () => {
            this.mainWindow.webContents.openDevTools();
        });
        localShortcut.register(this.mainWindow, "CommandOrControl+F", () => {
            this.mainWindow.webContents.send("on-find");
        });
    }
}

new Main();
//No need to store in a variable
