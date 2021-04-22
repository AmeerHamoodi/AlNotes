import { observable, makeObservable, action } from "mobx";

//INTERFACES
import { NotesStoreInterface } from "./interfaces";
import { NoteFrontInterface } from "./helpers/fronts/interfaces";

//LIBS
import DefaultStore from "./DefaultStore";
import NoteFront from "./helpers/fronts/NoteFront";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "./helpers/errors/StoreError";
import ResponseError from "./helpers/errors/ResponseError";

class NotesStore extends DefaultStore implements NotesStoreInterface {
    notesLoaded: boolean;
    notes: NoteFrontInterface[];

    constructor() {
        super();
        this.notesLoaded = false;
        this.notes = [];

        makeObservable(this, {
            notes: observable,
            notesLoaded: observable,
            _listenNotes: action
        })
    }
    /**
     * listens for getNotes:response
     */
    _listenNotes() {
        ipcRenderer.on("getNotes:response", (event:object, args: NoteFrontInterface[]) => {
            try {
                if(!Array.isArray(args)) throw new ResponseError("Invalid response for 'getNotes:response'");

                this.notes = args.map(item => new NoteFront(item.name, item.id));
                this.notesLoaded = false;

            } catch(e) {
                this._handleError(e);
            }
        })
    }
};

export default NotesStore;