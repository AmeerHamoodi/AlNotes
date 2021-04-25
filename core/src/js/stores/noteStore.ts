import { observable, action, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "./helpers/errors/StoreError";
import ResponseError from "./helpers/errors/ResponseError";

//INTERFACES
import { NoteStoreInterface, getNoteByIdResponse} from "./interfaces"


export default class NotesStore extends DefaultStore implements NoteStoreInterface {
    public noteLoaded: boolean;
    public noteContent: string;
    public noteId: string;
    public noteDate: string;
    public noteName: string;

    constructor() {
        super();

        this.noteContent = "";
        this.noteId = "";
        this.noteName = "Loading name...";
        this.noteDate = "";
        this.noteLoaded = false;

        makeObservable(this, {
            noteContent: observable,
            noteId: observable,
            noteDate: observable,
            noteLoaded: observable,
            _noteListener: action
        });

        this._noteListener();
    }

    _noteListener() {
        ipcRenderer.on("getNoteById:response", (event: object, args: getNoteByIdResponse) => {
            try {
                if(typeof args !== "object") throw new ResponseError("Invalid response from 'getNoteById:response'!");

                runInAction(() => {
                    this.noteContent = args.content;
                    this.noteName = args.name;
                    this.noteDate = args.date;
                    this.noteId = args.id;

                    console.log("res");

                    this.noteLoaded = true;
                });

            } catch(e) {
                this._handleError(e);
            }
        })
    };

    public getNote(className: string, unitName: string, id: string) {
        try {
            if(typeof className !== "string" || typeof unitName !== "string" || typeof id !== "string") throw new StoreError("Invalid unit, class or id data!");
            
            ipcRenderer.send("getNoteById", { unitName, className, id });

        } catch(e) {
            this._handleError(e);
        } 
    }

    public saveNote(className: string, unitName: string, id: string, content: string, name: string) {
        try {
            if(typeof content !== "string" || typeof name !== "string" || typeof id !== "string" || typeof className !== "string" 
            || typeof unitName !== "string") throw new StoreError("Invalid content, name or id!");
            
            ipcRenderer.send("saveData", {className, unitName, id, content, name})

        } catch(e) {
            this._handleError(e);
        }
        
    }

}