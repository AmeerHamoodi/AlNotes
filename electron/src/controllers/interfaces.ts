import { IpcMain, BrowserWindow } from "electron";

interface NotesControllerInterface {
    ipcMain: IpcMain;
    mainWindow: BrowserWindow;
    storage: object;
    settings: object;
    saveCalled: boolean;
    setAll: () => void;
    setSaveDataListeners: () => void;
    setGetFileListeners: () => void;
    getSettings: () => void;
    setUpdateSettingsListeners: () => void;
    setSaveFileListener: () => void;
    setDeleteListener: () => void;
};

interface ClassControllerInterface {
    ipcMain: IpcMain;
    mainWdinow: BrowserWindow;
    storage: object;
    settings: object;
    setAll: () => void;
    setGetClassesListener: () => void;
    setNewClassListener: () => void;
    setGetClassListener: () => void;
    setNewClassItemListeners: () => void;
    setDeleteClassItemListener: () => void;
    deleteClassListener: () => void;
    setUnitListeners: () => void;
    formulaSheetListener: () => void;
}


export { NotesControllerInterface, ClassControllerInterface }