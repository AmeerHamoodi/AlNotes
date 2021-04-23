import { observable, makeObservable, action, runInAction } from "mobx";

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
        });

        this._listenNotes();
    }
    /**
     * listens for getNotes:response
     */
    _listenNotes() {
        ipcRenderer.on("getNotes:response", (event:object, args: NoteFrontInterface[]) => {
            try {
                if(!Array.isArray(args)) throw new ResponseError("Invalid response for 'getNotes:response'");
                console.log(args);

                runInAction(() => {
                    this.notes = args.map(item => new NoteFront(item.name, item.id));
                    this.notesLoaded = true;
                    console.log("loaded");
                });

            } catch(e) {
                this._handleError(e);
            }
        })
    }
    /**
     * Gets notes
     * @param className Name of class
     * @param unitName Name of unit
     */
    public getNotes(className: string, unitName: string) {
        try {
            if(typeof className !== "string" || typeof unitName !== "string") throw new StoreError("Invalid className, unitName, or noteName!");
            ipcRenderer.send("getNotes", {className, unitName});
            console.log("called");
        } catch(e) {
            this._handleError(e);
        }
    }
    /**
     * Creates note
     * @param className Name of class
     * @param unitName Name of unit
     */
    public createNote(className: string, unitName: string, noteName: string) {
        try {
            if(typeof className !== "string" || typeof unitName !== "string" || typeof noteName !== "string") throw new StoreError("Invalid className or unitName!");
            ipcRenderer.send("newNote", {className, unitName, noteName})
        } catch(e) {
            this._handleError(e);
        }
    }
};

export default NotesStore;