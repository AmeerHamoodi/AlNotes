import { action, observable, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "./DefaultStore";
import ClassItemFront from "./helpers/fronts/ClassItemFront";

const { ipcRenderer } = window.require("electron");

//INTERFACES
import { ClassItemsInterface } from "./interfaces";
import { ClassItemFrontInterface } from "./helpers/fronts/interfaces";

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
    currentClass: string;

    constructor() {
        super();
        this.textbooks = [];
        this.labs = [];
        this.meetings = [];
        this.currentClass = "";
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

                const textbooks: ClassItemFrontInterface[] = args.textbooks.map(item => {
                    const textbook: ClassItemFrontInterface = new ClassItemFront(item.name, item.link);
                    textbook.deleteFunction = () => {
                        if (confirm("Are you sure you want to delete this item? This is irreversiable")) {
                            this.deleteClassItem(this.currentClass, "textbook", item.name);
                        }
                    };

                    return textbook;
                });

                const labs: ClassItemFrontInterface[] = args.labs.map(item => {
                    const lab: ClassItemFrontInterface = new ClassItemFront(item.name, item.link);
                    lab.deleteFunction = () => {
                        if (confirm("Are you sure you want to delete this item? This is irreversiable")) {
                            this.deleteClassItem(this.currentClass, "lab", item.name);
                        }
                    };

                    return lab;
                });

                const meetings: ClassItemFrontInterface[] = args.meetings.map(item => {
                    const meeting: ClassItemFrontInterface = new ClassItemFront(item.name, item.link);
                    meeting.deleteFunction = () => {
                        if (confirm("Are you sure you want to delete this item? This is irreversiable")) {
                            this.deleteClassItem(this.currentClass, "meeting", item.name);
                        } 
                    };

                    return meeting;
                })


                runInAction(() => {
                    this.textbooks = textbooks;
                    this.labs = labs;
                    this.meetings = meetings;

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
            if(typeof className !== "string" || className.length === 0 || !className.trim()) throw new StoreError("Invalid class name!");

            this.currentClass = className;

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

            if(data.name.length < 0 || !data.name.trim()) throw new StoreError("Name is invalid");
            if(data.link.length < 0 || !data.link.trim()) throw new StoreError("Link is invalid");

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