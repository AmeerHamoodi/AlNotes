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
    coreEditor: Quill
}

interface NoteDetails {
    name: string,
    date: string,
    unitName: string,
    className: string
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
    private setAllKeyEvents() {
        const { keyboard } = this.core;

        keyboard.addBinding({
            key: "S",
            shortKey: true
        }, () => {
            //this.store.saveNote()
        })
    }


    //SETTERS
    set coreEditor(q: Quill) {
        this.core = q;
        this.canStart = true;
    }
    set noteStore(store: NoteStoreInterface) {
        this.store = store;
    }
    set infoAboutNote(data: NoteDetails) {
        this.noteDetails = data;
    }

};

export default Core;

export { CoreInterface };