const Store = require('electron-store');

const store = new Store();

/**
 * ! TODO: Refactor this to have proper error handling
 */

class DataStorage {
    constructor() {
        this.db = null;
        this._init();
    }
    /**
     * Sets the db value by fetching data from user storage
     * @returns Simply returns to exit the function
     */
    _init() {
        if (typeof store.get("appData") === "undefined") {
            const data = {
                classes: {}
            };
            store.set("appData", JSON.stringify(data));
            return this.db = JSON.parse(store.get("appData"));
        }

        this.db = JSON.parse(store.get("appData"));
        this.db = this._patchData(this.db);

    }
    /**
     * Patches the data such that older versions of AlNotes will still work
     * @param {object} data DB object, essentially just this.db
     * @returns Exit function
     */
    _patchData(data) {
        if (typeof data.classes !== "undefined") {
            const classes = data.classes;
            for (let i in classes) {
                if (typeof classes[i].formulaSheet == "undefined") {
                    classes[i].formulaSheet = "";
                } else {
                    classes[i].formulaSheet = "";
                }
            }
            return data;
        }

        return data;
    }
    /**
     * Checks if note exists
     * @param {string} className Name of class
     * @param {string} unitName Name of unit
     * @param {string} id Id of note
     * @returns {boolean} Exists or not
     */
    noteExists(className, unitName, id) {
        return id in this.db.classes[className.toLowerCase()].units[unitName.toLowerCase()].notes;
    }
    /**
     * Formats class name
     * @param {string} className Name of class
     * @returns {string} Class name
     */
    formatClassName(className) {
        return className.toLowerCase();
    }
    /**
     * Returns the current date on machine as a string
     * @returns {string} Formatted date "M/d/Y"
     */
    getDate() {
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let stringed = `${month}/${day}/${year}`;

        return stringed;
    }
    /**
     * Creates a new note
     * @param {string} title Name of note
     * @param {string} content Default content to be added to note
     * @param {string} className Name of class
     * @param {string} unitName Name of unit
     * @returns {string | boolean} Will return false if note already exists otherwise will return the id
     */
    newNote(title, content, className, unitName) {
        let id = this.generateNoteId();
        if (!this.noteExists(className, unitName.toLowerCase(), id)) {
            this.db.classes[className].units[unitName.toLowerCase()].notes[id] = {
                content: content,
                name: title,
                date: this.getDate(),
                id: id
            };
            this.saveAll();
            return id;
        }
        return false;
    }
    /**
     * Updates note date, name and content
     * @param {string} id Id of note
     * @param {string} name Name of note
     * @param {string} content Content of note
     * @param {string} className Name of class
     * @param {string} unitName Name of unit
     */
    updateNote(id, name, content, className, unitName) {
        className = this.formatClassName(className);

        let note = this.db.classes[className].units[unitName.toLowerCase()].notes[id];
        note.content = this.noteExists(className, unitName.toLowerCase(), id) ? content : note.content;
        note.date = this.noteExists(className, unitName.toLowerCase(), id) ? this.getDate() : note.date;
        note.name = name;
        this.saveAll();
    }
    /**
     * 
     */
    saveAll() {
        store.set("appData", JSON.stringify(this.db));
    }
    getNotes(className, unitName) {
        className = this.formatClassName(className);
        let ob = this.db.classes[className].units[unitName.toLowerCase()].notes;
        let arr = [];
        for (let key in ob) {
            arr.push(ob[key]);
        }

        return arr;
    }
    getNoteByName(className, unitName, name) {
        className = this.formatClassName(className);
        let ob = this.db.classes[className].units[unitName.toLowerCase()].notes;
        for (let key in ob) {
            if (name == ob[key].name) {
                return ob[key];
            }
        }

        return false;
    }
    getNoteById(className, unitName, id) {
        className = this.formatClassName(className);
        let ob = this.db.classes[className].units[unitName.toLowerCase()].notes;

        for (let key in ob) {
            if (id == ob[key].id) {
                return ob[key];
            }
        }

        return false;
    }
    generateNoteId() {
        let id = Math.random().toString(36).slice(2);

        return id;
    }
    deleteNote(className, unitName, id) {
        className = this.formatClassName(className);
        if (this.noteExists(className, unitName.toLowerCase(), id)) {
            delete this.db.classes[className].units[unitName.toLowerCase()].notes[id];
            this.saveAll();
        } else {
            console.error("ERROR, ID NOT FOUND");
        }
    }
    deleteClass(className) {
        const classroom = this.formatClassName(className);

        if (this.classExists(classroom)) {
            delete this.db.classes[className];
            this.saveAll();
        } else {
            return false;
        }

    }
    classExists(className) {
        className = this.formatClassName(className);
        return className in this.db.classes;
    }
    createClass(className) {
        let temp = this.formatClassName(className);
        if (!this.classExists(temp)) {
            this.db.classes[temp] = {
                name: className,
                textbooks: [],
                labs: [],
                meetings: [],
                units: {},
                formulaSheet: ""
            }
        } else {
            console.log("Class already exists");
            return false;
        }
    }
    updateFormulaSheet(classname, params) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            this.db.classes[classroom].formulaSheet += params + "${$$$}";
            this.saveAll();
        } else {
            console.log("Class doesn't exist");
            return false;
        }
    }
    getFormulaSheet(classname) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            console.log(this.db.classes[classroom].formulaSheet)
            return this.db.classes[classroom].formulaSheet;
        }
    }
    addTextbook(classname, params) {
        console.log("tb", classname, params);
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            this.db.classes[classroom].textbooks.push(params);
        } else {
            console.log("Class doesn't exist");
            return false;
        }
    }
    addLab(classname, params) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            this.db.classes[classroom].labs.push(params);
        } else {
            console.log("Class doesn't exists");
            return false;
        }
    }
    addMeeting(classname, params) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            this.db.classes[classroom].meetings.push(params);
        } else {
            console.log("Class doesn't exists");
            return false;
        }
    }
    getClasses() {
        let arr = [];
        for (let key in this.db.classes) {
            arr.push(this.db.classes[key]);
        }
        return arr;
    }
    getClassByName(name) {
        for (let key in this.db.classes) {
            if (name.toLowerCase() == this.db.classes[key].name.toLowerCase()) {
                return this.db.classes[key];
            }
        }
        return false;
    }
    deleteTextbook(classname, name) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            let array = this.db.classes[classroom].textbooks;
            let i = array.indexOf(array.find(item => item.name == name));
            array.splice(i, 1);
            this.saveAll();
        }
    }
    deleteLab(classname, name) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            let array = this.db.classes[classroom].labs;
            let i = array.indexOf(array.find(item => item.name == name));

            array.splice(i, 1);
            this.saveAll();
        }
    }
    deleteMeeting(classname, name) {
        const classroom = classname.toLowerCase();
        if (this.classExists(classroom)) {
            let array = this.db.classes[classroom].meetings;
            let i = array.indexOf(array.find(item => item.name == name));

            array.splice(i, 1);
            this.saveAll();
        }
    }
    unitExists(className, name) {
        return typeof this.db.classes[className.toLowerCase()].units[name.toLowerCase()] !== "undefined";
    }
    newUnit({ className, unitName }) {
        const classroom = className.toLowerCase();

        if (this.unitExists(classroom, unitName)) return false;

        this.db.classes[classroom].units[unitName.toLowerCase()] = {
            name: unitName,
            notes: {}
        }
        this.saveAll();
    }
    deleteUnit(className, unitName) {
        const classroom = className.toLowerCase();
        if (!this.unitExists(classroom, unitName.toLowerCase())) return false;

        delete this.db.classes[classroom].units[unitName.toLowerCase()];
        this.saveAll();
    }
    getAllUnits(className) {
        const classroom = className.toLowerCase();

        if (!this.classExists(classroom)) return false;

        return Object.values(this.db.classes[classroom].units);
    }
    getUnit(className, unitName) {
        const classroom = className.toLowerCase();

        return this.db.classes[classroom].units[unitName.toLowerCase()];
    }
    exportClasses() {
        return JSON.stringify(Object.values(this.db.classes));
    }
    exportClass(classroom) {
        if (this.classExists(classroom)) {
            return JSON.stringify(this.db.classes[classroom])
        } else {
            throw new Error("Class: " + classroom + " does not exist :(");
        }
    }
}

module.exports = DataStorage;