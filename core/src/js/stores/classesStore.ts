import { action, observable, makeObservable } from "mobx";

import { ClassesStoreInterface } from "./interfaces";
import { ClassFrontInterface } from "./helpers/interfaces";
import ClassResponseError from "./helpers/ClassResponseError";

import API from "../api";
import ClassFront, { ConstParams } from "./helpers/ClassFront";

const { ipcRenderer } = window.require("electron");

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
            _classListener: action

        });

        this._classListener();
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

                this.classes = frontViewArray;
                this.classesLoaded = true;
                this.errorContent.occured = false;
                this.errorContent.data = "";

            } catch (e) {
                if (e.name !== "Class Response Error") {
                    this.errorContent.occured = true;
                    this.errorContent.data = "Unknown error occurred with the getAllClasses:response data!";
                } else {
                    this.errorContent.occured = true;
                    this.errorContent.data = e.message;
                }
            }
        })
    }

    public getClasses() {
        ipcRenderer.send("getAllClasses");
        console.log("called");
    }
}

export default ClassesStore;