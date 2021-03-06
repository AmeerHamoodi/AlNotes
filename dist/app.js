//LIBS
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const log = require("electron-log");
const contextMenu = require("electron-context-menu");
const { autoUpdater } = require("electron-updater");
const localShortcut = require("electron-localshortcut");
const Store = require("electron-store");
const path = require("path");
const isDev = require("electron-is-dev");
const { download } = require("electron-dl");

//INTERNALS
const DataStorage = require("./models/DataStorage");
const NotesController = require("./controllers/notes/NotesController");
const ClassController = require("./controllers/class/ClassController");
const SettingsController = require("./controllers/settings/SettingsController");
const UserSettings = require("./models/UserSettings");

const storage = new DataStorage();
const settings = new UserSettings(false);
const store = new Store();

autoUpdater.logger = log;

//if(isDev) require("electron-reload")(path.join(__dirname, "./electron/src/"))

class Main {
    constructor() {
        this.mainWindow = null;
        this.loadingWindow = null;
        this.isReadOnly = false;

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
        app.on("window-all-closed", function () {
            if (process.platform !== "darwin") app.quit(); //Mac patch
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
        this.mainWindow.loadURL(path.join(__dirname, "/public/index.html"));
        this.mainWindow.removeMenu();

        const webContents = this.mainWindow.webContents;

        webContents.once("dom-ready", () => {
            this.mainWindow.show();
            this.loadingWindow.close();
            this.showUpdateMessage();
            this.autoupdate();
            this.registerAutoShortcut();
            this.setSpellChecking();
        });

        webContents.on("dom-ready", () => {
            this.mainWindow.webContents.send(
                "isReadOnly:response",
                this.isReadOnly
            );
        });

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

        /**
         * Sets all of the controller listeners
         */
        this.notesController.setAll();
        this.classController.setAll();
        this.settingsController.setAll();

        this.registerUtilityListners();
    }

    /**
     * Old loading window/splash screen method, not used anymore
     */
    setLoadingWindow() {
        this.loadingWindow = new BrowserWindow({
            width: 500,
            height: 300,
            frame: false
        });
        this.loadingWindow.loadURL(path.join(__dirname, "public/loading.html"));
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

    registerUtilityListners() {
        this.mainWindow.on("close", () => {
            this.mainWindow.webContents.send("closing");
        });

        this.mainWindow.on("resize", () => {
            const size = this.mainWindow.getSize();
            settings.updateSize({ width: size[0], height: size[1] });
        });
        if (isDev) this.mainWindow.webContents.openDevTools(); //Comment this line out for production
        // this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        //     shell.shell.openExternal(url);

        //     return { action: "deny" };
        // });

        ipcMain.on("download", (event, data) => {
            download(this.mainWindow, data, { saveAs: true });
        });

        ipcMain.on("setReadOnly", (event, data) => {
            this.isReadOnly = true;
            this.mainWindow.webContents.send(
                "isReadOnly:response",
                this.isReadOnly
            );
        });

        ipcMain.on("isReadOnly", (event, data) => {
            this.mainWindow.webContents.send(
                "isReadOnly:response",
                this.isReadOnly
            );
        });
    }
}

new Main();
//No need to store in a variable
