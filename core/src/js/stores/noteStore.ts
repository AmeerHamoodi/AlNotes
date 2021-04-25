import { observable, makeObservable, runInAction } from "mobx";

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
    public noteTitle: string;

    constructor() {
        super();
        this.noteContent = "";
        this.noteId = "";
        this.noteTitle = "";
        this.noteDate = "";
        this.noteLoaded = false;

        makeObservable(this, {
            noteContent: observable,
            noteId: observable,
            noteDate: observable,
            noteLoaded: observable
        });

        this._noteListener();
    }

    private _noteListener() {
        ipcRenderer.on("getNoteById:response", (event: object, args: getNoteByIdResponse) => {
            try {
                if(typeof args !== "object") throw new ResponseError("Invalid response from 'getNoteById:response'!");

                runInAction(() => {
                    this.noteContent = args.content;
                    this.noteTitle = args.title;
                    this.noteDate = args.date;
                    this.noteId = args.id;

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

}