import { action, observable, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
import ClassItemFront from "./helpers/fronts/ClassItemFront";

const { ipcRenderer } = window.require("electron");

//INTERFACES
import { ClassItemsInterface } from "./interfaces";

type ClassItem = {
    name: string,
    link: string
}

type ClassContentResponse = {
    textbooks: ClassItem[],
    labs: ClassItem[],
    meetings: ClassItem[]
}

type CreationData = {
    name: string,
    link: string
}

//ERRORS
import ResponseError from "./helpers/errors/ResponseError";
import StoreError from "./helpers/errors/StoreError";

class ClassItemsStore extends DefaultStore implements ClassItemsInterface {
    textbooks: ClassItem[];
    labs: ClassItem[];
    meetings: ClassItem[];
    contentLoaded: boolean;

    constructor() {
        super();
        this.textbooks = [];
        this.labs = [];
        this.meetings = [];
        this.contentLoaded = false;

        makeObservable(this, {
            textbooks: observable,
            labs: observable,
            meetings: observable,
            contentLoaded: observable,
            _itemsListener: action
        });

        this._itemsListener();
    }

    /**
     * Listens for class content event
     */
    _itemsListener() {
        ipcRenderer.on("classContent", (event: object, args: ClassContentResponse) => {
            try {
                if(typeof args !== "object" && args !== null) throw new ResponseError("Invalid response");

                const { textbooks, labs, meetings } = args;

                runInAction(() => {
                    this.textbooks = textbooks.map(item => new ClassItemFront(item));
                    this.labs = labs.map(item => new ClassItemFront(item));
                    this.meetings = meetings.map(item => new  ClassItemFront(item));

                    this.contentLoaded = true;
                });                
            } catch(e) {
                this._handleError(e);
            }
        })
    }
    /**
     * Gets class content by name
     * @param className Name of class
     */
    public getClassContent(className: string) {
        try {
            if(typeof className !== "string") throw new StoreError("Invalid class name!");

            ipcRenderer.send("getClassContent", className);
        } catch(e) {
            this._handleError(e);
        } 
    }
    /**
     * Creates class item
     * @param className Name of class
     * @param type Type of class item "textbook" | "lab" | "meeting"
     * @param data Data to be sent for creation
     */
    public createClassItem(className: string, type: string | "textbook" | "lab" | "meeting", data: CreationData) {
        try {
            if(!["textbook", "lab", "meeting"].includes(type) || typeof className !== "string") throw new StoreError("Invalid class name or type");

            if(!("name" in data) || !("link" in data)) throw new StoreError("Name or link of item not included");

            ipcRenderer.send(`createNewClassItem:${type}`, {className, data});
        } catch(e) {
            this._handleError(e);
        }
    }
    /**
     * 
     * @param className Name of class
     * @param type Type of class item "textbook" | "lab" | "meeting"
     * @param name Name of class item
     */
    public deleteClassItem(className: string, type: string | "textbook" | "lab" | "meeting", name: string) {
        try {
            if(!["textbook", "lab", "meeting"].includes(type) || typeof className !== "string" 
            || typeof name !== "string") throw new StoreError("Invalid class name or type");

            ipcRenderer.send(`deleteClassItem:${type}`, {className, name});
        } catch(e) {
            this._handleError(e);
        }
    }
};

export default ClassItemsStore;