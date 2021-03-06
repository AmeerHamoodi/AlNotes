import { observable, action, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "./helpers/errors/StoreError";
import ResponseError from "./helpers/errors/ResponseError";

//INTERFACES
import { NoteStoreInterface, getNoteByIdResponse } from "./interfaces";

interface templatesViewInt {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

export default class NotesStore
    extends DefaultStore
    implements NoteStoreInterface {
    public noteLoaded: boolean;
    public noteContent: string;
    public noteId: string;
    public noteDate: string;
    public noteName: string;
    public unitName: string;
    public className: string;
    public showTemplateSearch: boolean;
    public templateSearch: templatesViewInt[];

    constructor() {
        super();

        this.noteContent = "";
        this.noteId = "";
        this.noteName = "";
        this.noteDate = "";
        this.unitName = "";
        this.className = "";
        this.noteLoaded = false;
        this.showTemplateSearch = false;
        this.templateSearch = [];

        makeObservable(this, {
            noteContent: observable,
            noteId: observable,
            noteDate: observable,
            noteLoaded: observable,
            showTemplateSearch: observable,
            _noteListener: action,
            setUnloaded: action,
            toggleSearch: action
        });

        this._noteListener();
    }

    _noteListener() {
        ipcRenderer.on(
            "getNoteById:response",
            (event: object, args: getNoteByIdResponse) => {
                try {
                    if (typeof args !== "object")
                        throw new ResponseError(
                            "Invalid response from 'getNoteById:response'!"
                        );

                    runInAction(() => {
                        this.noteContent = args.content;
                        this.noteName = args.name;
                        this.noteDate = args.date;
                        this.noteId = args.id;

                        this.noteLoaded = true;
                    });
                } catch (e) {
                    this._handleError(e);
                }
            }
        );
    }

    /**
     * Gets note by firing an ipcRenderer event to the main process
     * @param className Name of class
     * @param unitName Name of unit
     * @param id Id of note
     */

    public getNote(className: string, unitName: string, id: string) {
        try {
            if (
                typeof className !== "string" ||
                typeof unitName !== "string" ||
                typeof id !== "string"
            )
                throw new StoreError("Invalid unit, class or id data!");

            this.unitName = unitName;
            this.className = className;

            ipcRenderer.send("getNoteById", { unitName, className, id });
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * Updates the note with the new content
     * @param className Name of class {immutable}
     * @param unitName Name of unit {immutable}
     * @param id Name of id {immutable}
     * @param content Content of editor {mutable}
     * @param name Name of note {mutable}
     */

    public saveNote(
        className: string,
        unitName: string,
        id: string,
        content: string,
        name: string
    ) {
        try {
            if (
                typeof content !== "string" ||
                typeof name !== "string" ||
                typeof id !== "string" ||
                typeof className !== "string" ||
                typeof unitName !== "string"
            )
                throw new StoreError("Invalid content, name or id!");

            ipcRenderer.send("saveData", {
                className,
                unitName,
                id,
                content,
                name
            });
        } catch (e) {
            this._handleError(e);
        }
    }
    /**
     * Unloads note, i.e. sets noteloaded to false
     */
    public setUnloaded() {
        this.noteLoaded = false;
    }

    public toggleSearch() {
        this.showTemplateSearch = !this.showTemplateSearch;
    }

    public addSearch(templateData: templatesViewInt[]) {
        this.templateSearch = templateData;
    }
}
