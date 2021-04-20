require("bytenode");
const { app, BrowserWindow, ipcMain, dialog, clipboard } = require("electron");
const log = require("electron-log");
const contextMenu = require("electron-context-menu")
const { autoUpdater } = require("electron-updater")
const localShortcut = require("electron-localshortcut");
const Store = require("electron-store");
const Storage = require("./storage.jsc");
const NoteListeners = require("./libs/NoteListeners.jsc");
const ClassListeners = require("./libs/ClassListeners.jsc");
const UserSettings = require("./libs/userSettings.jsc");
const path = require("path");
const exec = require("child_process").exec;


const storage = new Storage();
const settings = new UserSettings();
const store = new Store();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';


class Main {
    constructor() {
        let self = this;
        this.mainWindow = null;
        this.loadingWindow = null;
        this.ankiPath = "C:/Program Files/Anki/anki.exe";

        this._init();

    }
    _init() {
        app.whenReady().then(() => {
            this.setWindowMain();
            log.info(path.join(__dirname, "../devBuild/index.html"))
            this.noteListeners.setAll();
            this.classListeners.setAll();
            this.startAnki();

            const webContents = this.mainWindow.webContents;

            webContents.once("dom-ready", () => {
                console.log("showing...");
                this.mainWindow.show();
                this.checkVers();
                this.autoupdate();
                this.registerAutoShortcut();
                this.setSpellChecking();
            })
        });
        this.unloadFunc();
    }
    unloadFunc() {
        app.once("before-quit", () => {
            storage.saveAll();
            console.log("test....");
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
        this.mainWindow.loadURL(path.join(__dirname, "/../devBuild/index.html"));
        this.mainWindow.removeMenu();
        this.noteListeners = new NoteListeners(ipcMain, this.mainWindow, storage, settings);
        this.classListeners = new ClassListeners(ipcMain, this.mainWindow, storage, settings);

        this.mainWindow.on("close", () => {
            this.mainWindow.webContents.send("closing");
        });

        this.mainWindow.on("resize", () => {
            const size = this.mainWindow.getSize();
            const sizeData = { width: size[0], height: size[1] }
            console.log(sizeData);
            settings.updateSize(sizeData);
        });

        this.getLogsListener();
    }
    setLoadingWin() {
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
    checkVers() {
        const currentVersion = store.get("version");

        if (typeof currentVersion == "undefined") {
            store.set("version", app.getVersion());
        }

        if (currentVersion !== app.getVersion()) {
            console.log("true");
            this.mainWindow.webContents.send("showJustUpdated");
            store.set("version", app.getVersion());
        }
    }
    autoupdate() {
        const sendStatusToWindow = (message) => {
            this.mainWindow.webContents.send("updateMessage", message);
        }
        autoUpdater.checkForUpdatesAndNotify();

        autoUpdater.on('update-available', (info) => {
            this.mainWindow.webContents.send("updateMessage", "Update available!");
        })

        autoUpdater.on('update-downloaded', (info) => {
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
            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
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
    startAnki() {
        try {
            exec(this.ankiPath);
            console.log(this.ankiPath);
        } catch (e) {
            dialog.showMessageBox("The anki path on your machine is incorrect, please start anki manually");
        }
    }
    getLogsListener() {
        ipcMain.on("client_getLogs", () => {
            this.mainWindow.webContents.send("getLogs");
        })


        ipcMain.on("newLogsUpdate", (ev, data) => {
            const oldData = store.get("errorLogs");
            let temp = {};
            if (typeof oldData !== "undefined") {
                temp = {...oldData };
            }
            let date = new Date();

            let time = date.getTime();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            let stringed = `${month}/${day}/${year}[${time}]`;

            temp[stringed] = data;
            console.log(stringed, temp[stringed].logs);

            store.set("errorLogs", temp);
            clipboard.writeText(JSON.stringify(temp));
        })
    }

}

const main = new Main();