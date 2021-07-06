import { observable, action, makeObservable, runInAction } from "mobx";

//LIBS
import DefaultStore from "../DefaultStore";
const { ipcRenderer } = window.require("electron");

//ERRORS
import StoreError from "../helpers/errors/StoreError";
import ResponseError from "../helpers/errors/ResponseError";

//INTERFACES
import { StudySheetStoreInterface } from "../interfaces";
import { StudySheetItem } from "../../core/studySheet/parseStudySheet";

interface templatesViewInt {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

export default class StudySheetStore
    extends DefaultStore
    implements StudySheetStoreInterface {
    public data: StudySheetItem[];
    public showTemplateSearch: boolean;
    public templateSearch: templatesViewInt[];
    public isLoaded: boolean;
    public className: string;

    constructor() {
        super();

        this.data = [];
        this.isLoaded = false;
        this.showTemplateSearch = false;
        this.templateSearch = [];

        makeObservable(this, {
            isLoaded: observable,
            showTemplateSearch: observable,
            templateSearch: observable,
            _studySheetListener: action,
            setUnloaded: action,
            toggleSearch: action,
            addSearch: action
        });

        this._studySheetListener();
    }

    _studySheetListener() {
        ipcRenderer.on(
            "fetchStudySheet:response",
            (event: object, args: StudySheetItem[]) => {
                try {
                    if (!Array.isArray(args))
                        throw new ResponseError(
                            "Invalid response from 'fetchStudySheet:response'!"
                        );

                    runInAction(() => {
                        this.data = args;
                        this.isLoaded = true;
                    });
                } catch (e) {
                    console.log(e);
                    this._handleError(e);
                }
            }
        );
    }

    public getStudySheet(className: string) {
        try {
            if (typeof className !== "string")
                throw new StoreError("Invalid class name!");

            this.className = className;

            ipcRenderer.send("fetchStudySheet", { className });
        } catch (e) {
            this._handleError(e);
        }
    }

    public setUnloaded() {
        this.isLoaded = false;
    }

    public toggleSearch() {
        this.showTemplateSearch = !this.showTemplateSearch;
    }

    public addSearch(templateData: templatesViewInt[]) {
        this.templateSearch = templateData;
    }

    public saveStudySheet(className: string, newData: string) {
        ipcRenderer.send("saveStudySheet", { className, newData });
    }
}
