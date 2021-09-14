import { Quill } from "react-quill";
import { autorun } from "mobx";

//STORES
import SettingsStore, { keyboardSettingRaw } from "../stores/settingsStore";

//CONFIGS AND MODULES
import quillToolbar, { quillToolbarType } from "./config/toolbar";
import formats from "./config/formats";
import registerAllShortcuts from "./helpers/shortcutKeys";
import UTILS from "./utils";
import registerEmbeds from "./embeds";

//INTERFACES AND TYPES
import {
    NoteStoreInterface,
    SettingsStoreInterface
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
    /** Actual templates */
    templates: templatesViewInt[];
    /** Automatically sets content of quill editor */
    autoSetEditorContent: () => void;
    /** Attaches the react setSaveState to the core to allow the state to be elegantely updated */
    attachSaveState: (setSaveState: any) => void;
    /** Attaches the templates to core object */
    attachTemplates: (templates: templatesViewInt[]) => void;
    /** Save note */
    saveNote: () => void;
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
    private store: NoteStoreInterface;
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
    private callAll(keyboardSettings: keyboardSettingRaw[]) {
        this.setAllKeyEvents(keyboardSettings);
        this.setEditorContent();
    }

    /** Sets all listeners and CBs for keyboard */
    private setAllKeyEvents(keyboardSettings: keyboardSettingRaw[]) {
        const { keyboard } = this.core;
        //SAVE
        //Have to set save keybinding here for obvious reasons
        keyboard.addBinding(
            {
                key: "S",
                shortKey: true
            },
            () => {
                this.saveNote();
            }
        );
        //FORMAT SHORTCUTS
        registerAllShortcuts(keyboard, keyboardSettings, this);
    }

    /** Sets the editor content with the content loaded from the store */
    private setEditorContent() {
        if (!this.store.noteContent.includes("{")) return this.core.setText("");

        const content = JSON.parse(this.store.noteContent);
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

    public saveNote() {
        const jsonContent = JSON.stringify(this.core.getContents());
                this.store.saveNote(
                    this.store.className,
                    this.store.unitName,
                    this.store.noteId,
                    jsonContent,
                    this.noteDetails.name
                );
                this.setSaveState(`Last saved: ${UTILS.getTime()}`);
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
        return this.store;
    }
}

export default Core;

export { CoreInterface };
