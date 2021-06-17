import { action, observable, makeObservable, runInAction } from "mobx";

import DefaultStore from "../DefaultStore";
const { ipcRenderer } = window.require("electron");

//INTERFACES
import { UpdateStoreInterface } from "../interfaces";

//ERRORS
import StoreError from "../helpers/errors/StoreError";
import ResponseError from "../helpers/errors/ResponseError";

type updateContent = {
    progress: string;
};

class UpdateStore extends DefaultStore implements UpdateStoreInterface {
    public updateContent: updateContent;
    public updateOccurred: boolean;

    constructor() {
        super();
        this.updateContent = {
            progress: ""
        };
        this.updateOccurred = false;

        makeObservable(this, {
            updateContent: observable,
            updateOccurred: observable,
            _updateListener: action
        });

        this._updateListener();
    }

    public _updateListener() {
        ipcRenderer.on("updateMessage", (event: any, args: string) => {
            try {
                if (typeof args !== "string")
                    throw new ResponseError("Invalid update response");

                runInAction(() => {
                    this.updateContent = {
                        progress: args
                    };
                    this.updateOccurred = true;
                });
            } catch (e) {
                console.log(e);
                this._handleError(e);
            }
        });
    }
}

export default UpdateStore;
