import { Quill } from "react-quill";

//CONFIGS
import quillToolbar, { quillToolbarType } from "./config/toolbar";
import formats from "./config/formats";


//INTERFACES AND TYPES
import { NoteStoreInterface } from "../stores/interfaces";

interface Modules {
    syntax: boolean,
    toolbar: quillToolbarType
}

interface CoreInterface {
    modules: Modules,
    formats: string[],
    coreEditor: Quill,
    infoAboutNote: NoteDetails,
    noteStore: NoteStoreInterface
}

interface NoteDetails {
    name: string,
}

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

    constructor() {
        this.modules = {
            toolbar: quillToolbar,
            syntax: true
        };
        this.formats = formats;
    }

    //PRIVATE METHODS
    private callAll() {
        this.setAllKeyEvents();
        this.setEditorContent();
    }

    private setAllKeyEvents() {
        const { keyboard } = this.core;
        keyboard.addBinding({
            key: "S",
            shortKey: true
        }, () => {
            const jsonContent = JSON.stringify(this.core.getContents());
            this.store.saveNote(this.store.className, this.store.unitName, this.store.noteId, jsonContent, this.noteDetails.name);
        })
    }
    
    private setEditorContent() {
        const content = JSON.parse(this.store.noteContent);
        this.core.setContents(content);
    }


    //SETTERS
    set coreEditor(q: Quill) {
        this.core = q;
        this.canStart = true;
        if (typeof q === "object" && q !== null) this.callAll();
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