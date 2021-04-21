import { action, observable, makeObservable, runInAction } from "mobx";

//INTERFACES
import { UnitsStoreInterface } from "./interfaces";
import { UnitFrontInterface } from "./helpers/fronts/interfaces";

//LIBS
import UnitFront, { UnitFrontParams } from "./helpers/fronts/UnitFront";
import DefaultStore from "./DefaultStore";

//ERROS
import ResponseError from "./helpers/errors/ResponseError";
import StoreError from "./helpers/errors/StoreError";

const { ipcRenderer } = window.require("electron")

class UnitsStore extends DefaultStore implements UnitsStoreInterface {
    units: UnitFront[];
    unitsLoaded: boolean;

    constructor() {
        super();
        this.units = [];
        this.unitsLoaded = false;

        makeObservable(this, {
            units: observable,
            unitsLoaded: observable,
            _unitsListener: action
        });

        this._unitsListener();
    }

    /**
     * Listens for unit response info
     */
    _unitsListener() {
        ipcRenderer.on("getAllUnits:response", (event: object, data: object[]) => {
            try {
                if (!Array.isArray(data)) throw new ResponseError("Invalid response data");

                const frontViewArray: UnitFrontInterface[] = Array.isArray(data) &&
                    data.map((item: UnitFrontParams) => new UnitFront(item));


                console.log(frontViewArray);

                runInAction(() => {
                    this.units = frontViewArray;
                    this.unitsLoaded = true;
                    this.errorContent.occured = false;
                    this.errorContent.data = "";
                })
            
            } catch (e) {
                this._handleError(e);
            }
        })
    }

    /**
     * Gets all units using className
     * @param className Name of the class
     */
    public getUnits(className: string) {
        try {
            if(typeof className !== "string") throw new StoreError("Invalid class name!");

            ipcRenderer.send("getAllUnits", className);
        } catch(e) {
            this._handleError(e);
        }
    }

    /**
     * Creates new unit using className
     * @param className Name of class
     * @param unitName Name of unit
     */

    public createUnit(className: string, unitName: string) {
        try {
            if(typeof className !== "string" || typeof unitName !== "string") throw new StoreError("Invalid unit or class name!");

            ipcRenderer.send("createNewUnit", {className, unitName});
            console.log({className, unitName})
        } catch(e) {
            this._handleError(e);
        }
    }
};

export default UnitsStore;