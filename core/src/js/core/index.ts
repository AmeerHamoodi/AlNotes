import { Quill } from "react-quill";

//CONFIGS AND MODULES
import quillToolbar, { quillToolbarType } from "./config/toolbar";
import formats from "./config/formats";
import registerAllShortcuts, { patchListeners } from "./helpers/shortcutKeys";
import Inline, { InlineStatic } from "./inline";


//INTERFACES AND TYPES
import { NoteStoreInterface } from "../stores/interfaces";

interface Modules {
    syntax: boolean,
    toolbar: quillToolbarType
}

interface CoreInterface {
    /** Quill modules data */
    modules: Modules,
    /** Formats available for use */
    formats: string[],
    /** Quill object, used to perform mutations on the quill editor */
    coreEditor: Quill,
    /** Simply just the note name, more may be added in the future, but this is mutable information about the note unobtainable from the content */
    infoAboutNote: NoteDetails,
    /** MobX store for note */
    noteStore: NoteStoreInterface,
    /** Automatically sets content of quill editor */
    autoSetEditorContent: () => void
}

interface NoteDetails {
    name: string,
}

class Core implements CoreInterface {
    //PRIVATE
    private core: Quill;
    private toolbar: quillToolbarType = quillToolbar;
    private canStart: boolean = false;
    private inlineHandler: InlineStatic;
    private store: NoteStoreInterface;
    private noteDetails: NoteDetails;

    //PUBLIC
    public modules: Modules;
    public formats: string[];

    constructor() {
        this.modules = {
            toolbar: quillToolbar,
            syntax: true
        };
        this.formats = formats;
    }

    //PRIVATE METHODS
    /** Just calls all methods needed to initialize an editor */
    private callAll() {
        this.setInlineHandler();
        this.setAllKeyEvents();
        this.setEditorContent();
    }


    /** Sets all listeners and CBs for keyboard */
    private setAllKeyEvents() {
        const { keyboard } = this.core;
        //SAVE
        keyboard.addBinding({
            key: "S",
            shortKey: true
        }, () => {
            const jsonContent = JSON.stringify(this.core.getContents());
            this.store.saveNote(this.store.className, this.store.unitName, this.store.noteId, jsonContent, this.noteDetails.name);
        });
        //FORMAT SHORTCUTS
        registerAllShortcuts(keyboard, this.inlineHandler);

        //PATCHES
        patchListeners(this.inlineHandler);
    }
    
    /** Sets the editor content with the content loaded from the store */

    private setEditorContent() {
        if(!this.store.noteContent.includes("{")) return this.core.setText("");
        
        const content = JSON.parse(this.store.noteContent);
        this.core.setContents(content);
    }

    private setInlineHandler() {
        this.inlineHandler = new Inline(this.core);
        console.log("Inline handler set...", this.inlineHandler)
    }

    //PUBLIC
    /** Public method for setEditorContent */
    public autoSetEditorContent() {
        this.setEditorContent();
    }


    //SETTERS
    set coreEditor(q: Quill) {
        this.core = q;
        this.canStart = true;
        this.callAll();
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

};

export default Core;

export { CoreInterface };