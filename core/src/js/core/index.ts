import { Quill } from "react-quill";
import { Quill as RealQuill } from "quill";
import { autorun } from "mobx";

//STORES
import SettingsStore, {
    keyboardSettingRaw
} from "../stores/settingsPage/SettingsStore";

//CONFIGS AND MODULES
import quillToolbar, { quillToolbarType } from "./config/toolbar";
import formats from "./config/formats";
import registerAllShortcuts from "./keyboard/shortcutKeys";
import UTILS from "./utils";
import registerEmbeds from "./embeds";
import parseStudySheet, { StudySheetItem } from "./studySheet/parseStudySheet";

//INTERFACES AND TYPES
import {
    NoteStoreInterface,
    SettingsStoreInterface,
    StudySheetStoreInterface
} from "../stores/interfaces";

interface Modules {
    syntax: boolean;
    toolbar: quillToolbarType;
}

interface CoreInterface {
    /** Quill modules data */
    modules: Modules;
    /** Formats available for use */
    formats: string[];
    /** Quill object, used to perform mutations on the quill editor */
    coreEditor: Quill;
    /** Simply just the note name, more may be added in the future, but this is mutable information about the note unobtainable from the content */
    infoAboutNote: NoteDetails;
    /** MobX store for note */
    noteStore: NoteStoreInterface;
    /** MobX store for studysheet */
    studySheetStore: StudySheetStoreInterface;
    /** Actual templates */
    templates: templatesViewInt[];
    /** Automatically sets content of quill editor */
    autoSetEditorContent: () => void;
    /** Attaches the react setSaveState to the core to allow the state to be elegantely updated */
    attachSaveState: (setSaveState: any) => void;
    /** Attaches the templates to core object */
    attachTemplates: (templates: templatesViewInt[]) => void;
    /** Creates studysheet based editor */
    createStudySheet: (q: Quill) => void;
    /** Unsets all listeners and core from base editor */
    unsetAll: () => void;
}

interface templatesViewInt {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

interface NoteDetails {
    name: string;
}

const settingsStore: SettingsStoreInterface = new SettingsStore();

class Core implements CoreInterface {
    //PRIVATE
    private core: Quill;
    private toolbar: quillToolbarType = quillToolbar;
    private canStart: boolean = false;
    private store: NoteStoreInterface | StudySheetStoreInterface;
    private noteDetails: NoteDetails;

    //PUBLIC
    public modules: Modules;
    public formats: string[];
    public setSaveState: (newData: string) => void;
    public templates: templatesViewInt[];

    constructor() {
        this.modules = {
            toolbar: quillToolbar,
            syntax: true
        };
        this.formats = formats;
        this.templates = [];
    }

    //PRIVATE METHODS
    /** Just calls all methods needed to initialize an editor */
    private callAll(
        keyboardSettings: keyboardSettingRaw[],
        isStudysheet: boolean = false
    ) {
        this.setAllKeyEvents(keyboardSettings, isStudysheet);

        if (isStudysheet) {
            const studySheetStore = this.store as StudySheetStoreInterface;

            parseStudySheet(studySheetStore.data, this.core);
        } else {
            this.setEditorContent();
        }
    }

    /** Sets all listeners and CBs for keyboard */
    private setAllKeyEvents(
        keyboardSettings: keyboardSettingRaw[],
        isStudysheet: boolean
    ) {
        const { keyboard } = this.core;
        //SAVE
        //Have to set save keybinding here for obvious reasons

        if (!isStudysheet) {
            keyboard.addBinding(
                {
                    key: "S",
                    shortKey: true
                },
                () => {
                    const jsonContent = JSON.stringify(this.core.getContents());
                    const store = this.store as NoteStoreInterface;
                    store.saveNote(
                        store.className,
                        store.unitName,
                        store.noteId,
                        jsonContent,
                        this.noteDetails.name
                    );
                    this.setSaveState(`Last saved: ${UTILS.getTime()}`);
                }
            );
        } else {
            keyboard.addBinding(
                {
                    key: "S",
                    shortKey: true
                },
                () => {
                    const store = this.store as StudySheetStoreInterface;
                    const jsonContent = JSON.stringify(this.core.getContents());
                    store.saveStudySheet(store.className, jsonContent);
                    this.setSaveState(`Last saved: ${UTILS.getTime()}`);
                }
            );
        }

        //FORMAT SHORTCUTS
        registerAllShortcuts(keyboard, keyboardSettings, this);
    }

    /** Sets the editor content with the content loaded from the store */
    private setEditorContent() {
        const store = this.store as NoteStoreInterface;
        if (!store.noteContent.includes("{")) return this.core.setText("");

        const content = JSON.parse(store.noteContent);
        this.core.setContents(content);
    }

    //PUBLIC
    /** Public method for setEditorContent */
    public autoSetEditorContent() {
        this.setEditorContent();
    }

    /** Connects the state from the core react componenet to the core class */
    public attachSaveState(setSaveState: (data: string) => void) {
        this.setSaveState = setSaveState;
    }

    public attachTemplates(templates: templatesViewInt[]) {
        this.templates = templates;
        this.store.addSearch(templates);
    }
    /** Function to make the core functional between re-renders */
    public unsetAll() {
        this.core.keyboard = null;
        this.core = undefined;
        this.canStart = false;
    }

    // parseStudySheet(studySheetData, realQuill);

    /** Creates studysheet based on data (studysheet data is different than regular content) */
    public createStudySheet(q: Quill) {
        registerEmbeds();
        this.core = q;
        this.canStart = true;
        settingsStore.getKeyboard();

        autorun(() => {
            if (settingsStore.keyboardSettingsLoaded && this.canStart)
                this.callAll(settingsStore.rawKeyboardSettings, true);
        });
    }

    //SETTERS
    set coreEditor(q: Quill) {
        registerEmbeds();
        this.core = q;
        this.canStart = true;
        settingsStore.getKeyboard();

        autorun(() => {
            if (settingsStore.keyboardSettingsLoaded) {
                this.callAll(settingsStore.rawKeyboardSettings);
            }
        });
    }
    set noteStore(store: NoteStoreInterface) {
        this.store = store;
    }
    set studySheetStore(store: StudySheetStoreInterface) {
        this.store = store;
    }
    set infoAboutNote(data: NoteDetails) {
        this.noteDetails = data;
    }

    get infoAboutNote() {
        return this.noteDetails;
    }

    get coreEditor() {
        return this.core;
    }

    get noteStore() {
        return this.store as NoteStoreInterface;
    }
}

export default Core;

export { CoreInterface };
