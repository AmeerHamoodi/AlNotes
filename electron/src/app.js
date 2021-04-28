//LIBS
const { app, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const contextMenu = require("electron-context-menu")
const { autoUpdater } = require("electron-updater")
const localShortcut = require("electron-localshortcut");
const Store = require("electron-store");
const path = require("path");


//INTERNALS
const DataStorage = require("./models/DataStorage");
const NotesController = require("./controllers/notes/NotesController");
const ClassController = require("./controllers/class/ClassController");
const UserSettings = require("./models/UserSettings");

const storage = new DataStorage();
const settings = new UserSettings();
const store = new Store();

autoUpdater.logger = log;


class Main {
    constructor() {
        this.mainWindow = null;
        this.loadingWindow = null;

        this._init();

    }

    _init() {
        app.whenReady().then(() => {
            this.setWindowMain();

            const webContents = this.mainWindow.webContents;

            webContents.once("dom-ready", () => {
                this.mainWindow.show();
                this.showUpdateMessage();
                this.autoupdate();
                this.registerAutoShortcut();
                this.setSpellChecking();
            })
        });
        this.beforeCloseFunctions();
    }

    beforeCloseFunctions() {
        app.once("before-quit", () => {
            storage.saveAll();
        });
        app.on('window-all-closed', function() {
            if (process.platform !== 'darwin') app.quit()
        })
    }

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
        this.mainWindow.loadURL(path.join(__dirname, "/public/index.html"));
        this.mainWindow.removeMenu();

        this.notesController = new NotesController(ipcMain, this.mainWindow, storage, settings);
        this.classController = new ClassController(ipcMain, this.mainWindow, storage, settings);

        this.notesController.setAll();
        this.classController.setAll();

        this.mainWindow.on("close", () => {
            this.mainWindow.webContents.send("closing");
        });

        this.mainWindow.on("resize", () => {
            const size = this.mainWindow.getSize();
            settings.updateSize({ width: size[0], height: size[1] });
        });

        this.mainWindow.webContents.openDevTools();
    }

    setLoadingWindow() {
        this.loadingWindow = new BrowserWindow({
            width: 400,
            height: 300,
            frame: false
        });
        this.loadingWindow.loadURL(path.join(__dirname, "../devBuild/loading.html"));
    }

    setSpellChecking() {
        contextMenu({ showInspectElement: false });
    }

    showUpdateMessage() {
        const currentVersion = store.get("version");

        if (typeof currentVersion == "undefined") store.set("version", app.getVersion());

        if (currentVersion !== app.getVersion()) {
            this.mainWindow.webContents.send("showJustUpdated");
            store.set("version", app.getVersion());
        }
    }

    autoupdate() {
        const sendStatusToWindow = (message) => {
            this.mainWindow.webContents.send("updateMessage", message);
        }
        autoUpdater.checkForUpdatesAndNotify();

        autoUpdater.on('update-available', () => {
            this.mainWindow.webContents.send("updateMessage", "Update available!");
        })

        autoUpdater.on('update-downloaded', () => {
            autoUpdater.quitAndInstall();
        })

        autoUpdater.on('checking-for-update', () => {
            sendStatusToWindow('Checking for update...');
        })
        autoUpdater.on('update-available', (info) => {
            sendStatusToWindow('Update available.');
        })
        autoUpdater.on('update-not-available', (info) => {
            sendStatusToWindow('Update not available.');
        })
        autoUpdater.on('error', (err) => {
            sendStatusToWindow('Error in auto-updater. ' + err);
        })
        autoUpdater.on('download-progress', (progressObj) => {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
            log_message = log_message + ' (' + Math.round(progressObj.transferred) + "/" + Math.round(progressObj.total) + ')';
            sendStatusToWindow(log_message);
        })
        autoUpdater.on('update-downloaded', (info) => {
            sendStatusToWindow('Update downloaded');
        });
    }

    registerAutoShortcut() {
        localShortcut.register(this.mainWindow, "CommandOrControl+R", () => {
            this.mainWindow.reload();
        });
        localShortcut.register(this.mainWindow, "F12", () => {
            this.mainWindow.webContents.openDevTools();
        });
        localShortcut.register(this.mainWindow, "CommandOrControl+F", () => {
            this.mainWindow.webContents.send("on-find");
        })
    }

}

new Main();