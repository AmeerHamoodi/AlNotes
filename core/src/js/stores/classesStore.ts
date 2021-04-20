import { action, observable, makeObservable } from "mobx";

import { ClassesStoreInterface } from "./interfaces";
import { ClassFrontInterface } from "./helpers/interfaces";

import API from "../api";
import ClassFront, { ConstParams } from "./helpers/ClassFront";

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
            getClasses: action,
            createClass: action,
            deleteClass: action

        });
    }
    /**
     * Sets the two properties
     */
    async getClasses() {
        try {
            const data = await API.getClasses();
            
            const loopData = JSON.parse(JSON.parse(data).message);

            const arrayData: ClassFrontInterface[] = [];
            
            loopData.forEach((item: ConstParams) => {
                const newItem = new ClassFront(item);
                arrayData.push(newItem);
            });

            this.classes = arrayData;
            this.classesLoaded = true;
            
        } catch(e) {
            this.errorContent.occured = true;
            this.errorContent.data = e.message;
        }
    }
    /**
     * Creates class from name
     * @param {string} className The name of the class you want to create
     */
    async createClass(className: string) {
        if (typeof className !== "string") {
            this.errorContent = {
                occured: true,
                data: "Class name must be a string"
            };
        } else {
            try {
                await API.createClass({ className });

                this.errorContent = {
                    occured: false,
                    data: ""
                };

                this.getClasses();
            } catch (e) {
                this.errorContent = {
                    occured: true,
                    data: e.message
                };
            }
        }
    }

    async deleteClass(id: string) {
        if(typeof id !== "string") {
            this.errorContent = {
                occured: true,
                data: "There was a store error"
            };
        } else {
            try {
                await API.deleteClass(id);

                this.errorContent = {
                    occured: false,
                    data: ""
                };

                this.getClasses();

            } catch(e) {
                this.errorContent = {
                    occured: true,
                    data: e.message
                }
            }
        }
    }
}

export default ClassesStore;