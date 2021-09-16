import { action, observable, makeObservable, runInAction } from "mobx";

//INTERFACES
import { ClassesStoreInterface } from "./interfaces";
import { ClassFrontInterface } from "./helpers/fronts/interfaces";

//HELPERS
import ClassFront, { ConstParams } from "./helpers/fronts/ClassFront";
import DefaultStore from "./DefaultStore";

//ERRORS
import ResponseError from "./helpers/errors/ResponseError";
import StoreError from "./helpers/errors/StoreError";

const { ipcRenderer } = window.require("electron");

declare global {
    interface Window {
        ipcRenderer: any;
    }
}

/**
 * Classes store class, contains all of the data regarding classes
 */
class ClassesStore extends DefaultStore implements ClassesStoreInterface {
    classes: object[];
    archivedClasses: object[];
    classesLoaded: boolean;
    /**
     * Sets classes as an array <observable> and classesLoaded as a boolean <observable>
     */
    constructor() {
        super();
        this.classes = [];
        this.archivedClasses = [];
        this.classesLoaded = false;

        makeObservable(this, {
            classes: observable,
            archivedClasses: observable,
            classesLoaded: observable,
            _classListener: action
        });

        this._classListener();
    }

    /**
     * Listens to the getAllClasses:response data
     */
    _classListener() {
        ipcRenderer.on(
            "getAllClasses:response",
            (event: object, data: object[]) => {
                try {
                    if (!Array.isArray(data))
                        throw new ResponseError("Invalid response data");

                    const rawFrontViewArray: ClassFrontInterface[] = data
                        .map((item: ConstParams) => {
                            const classroom: ClassFrontInterface = new ClassFront(
                                item
                            );
                            classroom.deleteFunction = () => {
                                if (
                                    confirm(
                                        "Last chance, turn back now! This process can not be reversed!"
                                    )
                                )
                                    this.deleteClass(item.name);
                            };
                            classroom.archiveFunction = () => {
                                if(item.archived) this.unarchiveClass(item.name);
                                else this.archiveClass(item.name);
                            };
                            return classroom;
                        });

                        const visibleViewArray = rawFrontViewArray.filter((item) => !item.archived);
                        const archivedViewArray = rawFrontViewArray.filter((item) => item.archived);

                    runInAction(() => {
                        this.classes = visibleViewArray;
                        this.archivedClasses = archivedViewArray;
                        this.classesLoaded = true;
                        this.errorContent.occured = false;
                        this.errorContent.data = "";
                    });
                } catch (e) {
                    this._handleError(e);
                }
            }
        );
    }

    /**
     * Sends request to electron backend for class data
     */
    public getClasses() {
        ipcRenderer.send("getAllClasses");
    }

    /**
     * Creates class using name
     * @param className Name of class
     */
    public createClass(className: string) {
        try {
            if (
                typeof className !== "string" ||
                className.length < 0 ||
                !className.trim()
            )
                throw new StoreError("Invalid classname!");

            ipcRenderer.send("newClass", className);
        } catch (e) {
            this._handleError(e);
        }
    }
    /**
     * Deletes class using class name
     * @param className Name of class
     */
    public deleteClass(className: string) {
        try {
            if (typeof className !== "string")
                throw new StoreError("Class name must be a string!");

            ipcRenderer.send("deleteClass", className);
        } catch (e) {
            this._handleError(e);
        }
    }

    public archiveClass(className: string) {
        try {
            if (typeof className !== "string")
                throw new StoreError("Class name must be a string!");

            ipcRenderer.send("archiveClass", className);
        } catch (e) {
            this._handleError(e);
        }
    }

    public unarchiveClass(className: string) {
        try {
            if (typeof className !== "string")
                throw new StoreError("Class name must be a string!");

            ipcRenderer.send("unarchiveClass", className);
        } catch (e) {
            this._handleError(e);
        }
    }
}

export default ClassesStore;
