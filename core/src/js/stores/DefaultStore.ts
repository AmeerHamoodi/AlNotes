import { action, observable, makeObservable, runInAction } from "mobx";

const { ipcRenderer } = window.require("electron");

/**
 * Default store, basically contains the error handling code for all stores
 */
class DefaultStore {
    errorContent: {
        occured: boolean,
        data: any
    };
    /**
     * Sets errorContent as an observable
     */
    constructor() {
        this.errorContent = {
            occured: false,
            data: ""
        };

        makeObservable(this, {
            errorContent: observable,
            _handleError: action

        });

        this._errorListener();
    }

    /**
     * Handles error by setting the error message.
     * @param e Error content
     */
    _handleError(e: Error) {
        console.log(e);
        switch (e.name) {
            case "Store Response Error":
                this.errorContent.occured = true;
                this.errorContent.data = `[Response Error]: ${e.message}`;
                break;
            case "Store Error":
                this.errorContent.occured = true;
                this.errorContent.data = `[Store Error]: ${e.message}`;
                break;
            default:
                this.errorContent.occured = true;
                this.errorContent.data = "Unknown error occurred with classesStore.createClass!";
        }
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
}

export default DefaultStore;