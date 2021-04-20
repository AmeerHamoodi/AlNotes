import { action, observable, makeObservable, runInAction } from "mobx";

import { ClassesStoreInterface } from "./interfaces";
import { ClassFrontInterface } from "./helpers/interfaces";


import ClassFront, { ConstParams } from "./helpers/ClassFront";

import ClassResponseError from "./helpers/ClassResponseError";
import ClassStoreError from "./helpers/ClassStoreError";

const { ipcRenderer } = window.require("electron");
console.log(ipcRenderer);

declare global {
    interface Window {
        ipcRenderer: any
    }
}

/**
 * Classes store class, contains all of the data regarding classes
 */
class ClassesStore implements ClassesStoreInterface {
    classes: object[];
    classesLoaded: boolean;
    errorContent: {
        occured: boolean,
        data: any
    };
    /**
     * Sets classes as an array <observable> and classesLoaded as a boolean <observable>
     */
    constructor() {
        this.classes = [];
        this.classesLoaded = false;
        this.errorContent = {
            occured: false,
            data: ""
        };

        makeObservable(this, {
            classes: observable,
            classesLoaded: observable,
            errorContent: observable,
            _classListener: action,
            _errorListener: action,
            _handleError: action

        });

        this._classListener();
        this._errorListener()
    }

    _handleError(e: Error) {
        console.log(e);
        switch (e.name) {
            case "Class Response Error":
                this.errorContent.occured = true;
                this.errorContent.data = `[Response Error]: ${e.message}`;
                break;
            case "Class Store Error":
                this.errorContent.occured = true;
                this.errorContent.data = `[Store Error]: ${e.message}`;
                break;
            default:
                this.errorContent.occured = true;
                this.errorContent.data = "Unknown error occurred with classesStore.createClass!";
        }
    }

    /**
     * Listens to the getAllClasses:response data
     */
    _classListener() {
        ipcRenderer.on("getAllClasses:response", (event: object, data: object[]) => {
            try {
                if (!Array.isArray(data)) throw new ClassResponseError("Invalid response data");

                const frontViewArray: ClassFrontInterface[] = Array.isArray(data) &&
                    data.map((item: ConstParams) => new ClassFront(item));


                runInAction(() => {
                    this.classes = frontViewArray;
                    this.classesLoaded = true;
                    this.errorContent.occured = false;
                    this.errorContent.data = "";
                })
            
            } catch (e) {
                this._handleError(e);
            }
        })
    }
    /**
     * Listens for any errors on electron backend
     */
    _errorListener() {
        ipcRenderer.on("classThread:error", (event: object, data: string) => {
            runInAction(() => {
                this.errorContent.occured = true;
                this.errorContent.data = data;
            });            
        })
    }

    /**
     * Sends request to electron backend for class data
     */
    public getClasses() {
        ipcRenderer.send("getAllClasses");
    }

    public createClass(className: string) {
        try {
            if(typeof className !== "string") throw new ClassStoreError("Class name must be a string!");

            ipcRenderer.send("newClass", className);

        } catch(e) {
            this._handleError(e);
        }
    }

}

export default ClassesStore;