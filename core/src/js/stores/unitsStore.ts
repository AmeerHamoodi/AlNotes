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
    units: UnitFrontInterface[];
    unitsLoaded: boolean;
    currentClass: string;
    exportContent: string;

    constructor() {
        super();
        this.units = [];
        this.unitsLoaded = false;
        this.currentClass = "";
        this.exportContent = "";

        makeObservable(this, {
            units: observable,
            unitsLoaded: observable,
            exportContent: observable,
            _unitsListener: action
        });

        this._unitsListener();
        this._unitExportListener();
    }

    /**
     * Listens for unit response info
     */
    _unitsListener() {
        ipcRenderer.on("getAllUnits:response", (event: object, data: object[]) => {
            try {
                if (!Array.isArray(data)) throw new ResponseError("Invalid response data");


                const frontViewArray: UnitFrontInterface[] = Array.isArray(data) &&
                    data.map((item: UnitFrontParams) => new UnitFront(item, this.currentClass));

                runInAction(() => {
                    this.units = frontViewArray.map((unit: UnitFrontInterface) => {
                        unit.deleteFunction = () => {
                            if (confirm("Are you sure you want to delete this unit? This is irreversiable")) this.deleteUnit(this.currentClass, unit.name);   
                        };
                        unit.exportFunction = () => {
                            this.exportUnit(this.currentClass, unit.name);
                        };
                        return unit;
                    });
                    this.unitsLoaded = true;
                    this.errorContent.occured = false;
                    this.errorContent.data = "";
                })

            } catch (e) {
                this._handleError(e);
            }
        })
    }

    _unitExportListener() {
        ipcRenderer.on("exportUnit:response", (event: object, data: string) => {
            try {
                if (typeof data !== "string") throw new ResponseError("Invalid response data");

                ipcRenderer.send("download", window.URL.createObjectURL(new Blob([data], {type: "text/plain"})));

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
            if (typeof className !== "string") throw new StoreError("Invalid class name!");
            this.currentClass = className;

            ipcRenderer.send("getAllUnits", className);
        } catch (e) {
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
            if (typeof className !== "string" || typeof unitName !== "string" || unitName.length < 0 || !unitName.trim() ) throw new StoreError("Invalid unit name!");

            ipcRenderer.send("createNewUnit", { className, unitName });
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * Deletes unit using className
     * @param className Name of class
     * @param unitName Name of unit
     */

    public deleteUnit(className: string, unitName: string) {
        try {
            if (typeof className !== "string" || typeof unitName !== "string") throw new StoreError("Invalid unit or class name");

            ipcRenderer.send("deleteUnit", { className, unitName });
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * Exports unit
     * @param className Name of class 
     * @param unitName Name of unit
     */
    public exportUnit(className: string, unitName: string) {
        try {
            if (typeof className !== "string" || typeof unitName !== "string") throw new StoreError("Invalid unit or class name");

            ipcRenderer.send("exportUnit", { className, unitName });
        } catch (e) {
            this._handleError(e);
        }
    }
};

export default UnitsStore;