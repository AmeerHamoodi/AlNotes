const Store = require('electron-store');
const { v4: uuid } = require("uuid");

const store = new Store();

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
         * Saves all of the data to persistent storage.
         */
    saveAll() {
            store.set("appData", JSON.stringify(this.db));
        }
        /**
         * Gets all of the notes
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @returns {object} All of the notes associated with class and unit
         */
    getNotes(className, unitName) {
            className = this.formatClassName(className);
            if (!this.classExists(className) || !this.unitExists(unitName)) return false;
            return Object.values(this.db.classes[className].units[unitName.toLowerCase()].notes);
        }
        /**
         * Gets note by id
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @param {string} id Id of note
         * @returns {boolean | object} Will return false if note can't be found, otherwise just the note
         */
    getNoteById(className, unitName, id) {
            className = this.formatClassName(className);

            if (!id in this.db.classes[className].units[unitName.toLowerCase()].notes) return false;

            return this.db.classes[className].units[unitName.toLowerCase()].notes[id];
        }
        /**
         * 
         * @returns {string} Random note id
         */
    generateNoteId() {
            return uuid();
        }
        /**
         * Deletes note by id
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @param {string} id Id of note
         * @returns {boolean | undefined} Will return nothing if successful, will return false if failed
         */
    deleteNote(className, unitName, id) {
            className = this.formatClassName(className);

            if (!this.noteExists(className, unitName.toLowerCase(), id)) return false;

            delete this.db.classes[className].units[unitName.toLowerCase()].notes[id];
            this.saveAll();
        }
        /**
         * Deletes class by name
         * @param {string} className Name of class
         * @returns {boolean | undefined} Will return nothing if successful, will return false if failed
         */
    deleteClass(className) {
            const classroom = this.formatClassName(className);

            if (!this.classExists(classroom)) return false;

            delete this.db.classes[classroom];
            this.saveAll();

        }
        /**
         * Checks if class exists
         * @param {string} className Name of class
         * @returns {boolean} Whether class exists or not
         */
    classExists(className) {
            className = this.formatClassName(className);
            return className in this.db.classes;
        }
        /**
         * Creates class using className
         * @param {string} className 
         * @returns {boolean | undefined} Will return false if failed, nothing if successful
         */
    createClass(className) {
            let temp = this.formatClassName(className);

            if (this.classExists(temp)) return false;

            this.db.classes[temp] = {
                name: className,
                textbooks: [],
                labs: [],
                meetings: [],
                units: {},
                formulaSheet: ""
            };

            this.saveAll();
        }
        /**
         * Adds textbook to class
         * @param {string} className Name of class 
         * @param {object} params Params of textbook
         * @returns {boolean | undefined} Returns false if failed
         */
    addTextbook(className, params) {
            const classroom = className.toLowerCase();
            if (!this.classExists(classroom)) return false;

            this.db.classes[classroom].textbooks.push(params);
        }
        /**
         * Adds lab to class
         * @param {string} className Name of class 
         * @param {object} params Params of lab
         * @returns {boolean | undefined} Returns false if failed
         */
    addLab(className, params) {
            const classroom = className.toLowerCase();
            if (!this.classExists(classroom)) return false;

            this.db.classes[classroom].labs.push(params);
        }
        /**
         * Adds meeting to class
         * @param {string} className Name of class 
         * @param {object} params Params of meeting
         * @returns {boolean | undefined} Returns false if failed
         */
    addMeeting(className, params) {
            const classroom = className.toLowerCase();
            if (!this.classExists(classroom)) return false;

            this.db.classes[classroom].meetings.push(params);
        }
        /**
         * Gets all of the classes
         * @returns {array} Array of class objects
         */
    getClasses() {
            return Object.values(this.db.classes);
        }
        /**
         * Gets class by name
         * @param {string} className Name of class
         * @returns {boolean | object} Returns false if failed or class
         */
    getClassByName(className) {
            if (!this.classExists(className)) return false;
            return this.db.classes[className.toLowerCase()];
        }
        /**
         * Deletes textbook
         * @param {string} className Name of class 
         * @param {string} name Name of textbook
         * @returns {boolean | undefined} Will return false if failed
         */
    deleteTextbook(className, name) {
            const classroom = className.toLowerCase();
            let array = this.db.classes[classroom].textbooks;

            if (!this.classExists(classroom)) return false;

            try {
                array.splice(array.indexOf(array.find(item => item.name == name)), 1);

                this.db.classes[classroom].textbooks = array;
                this.saveAll();
            } catch (e) {
                return false;
            }
        }
        /**
         * Deletes lab
         * @param {string} className Name of class 
         * @param {string} name Name of lab
         * @returns {boolean | undefined} Will return false if failed
         */
    deleteLab(className, name) {
            const classroom = className.toLowerCase();
            let array = this.db.classes[classroom].labs;

            if (!this.classExists(classroom)) return false;

            try {
                array.splice(array.indexOf(array.find(item => item.name == name)), 1);

                this.db.classes[classroom].labs = array;
                this.saveAll();
            } catch (e) {
                return false;
            }
        }
        /**
         * Deletes meeting
         * @param {string} className Name of class 
         * @param {string} name Name of meeting
         * @returns {boolean | undefined} Will return false if failed
         */
    deleteMeeting(className, name) {
            const classroom = className.toLowerCase();
            let array = this.db.classes[classroom].meetings;

            if (!this.classExists(classroom)) return false;

            try {
                array.splice(array.indexOf(array.find(item => item.name == name)), 1);

                this.db.classes[classroom].meetings = array;
                this.saveAll();
            } catch (e) {
                return false;
            }
        }
        /**
         * Checks if unit exists
         * @param {string} className Name of class
         * @param {string} name Name of unit
         * @returns {boolean}
         */
    unitExists(className, name) {
            return className.toLowerCase() in this.db.classes &&
                name.toLowerCase() in this.db.classes[className.toLowerCase()].units;
        }
        /**
         * Creates new unit
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @return {boolean | undefined} False if unit exists, otherwise nothing
         */
    newUnit(className, unitName) {
            const classroom = className.toLowerCase();

            if (this.unitExists(classroom, unitName)) return false;

            this.db.classes[classroom].units[unitName.toLowerCase()] = {
                name: unitName,
                notes: {}
            }
            this.saveAll();
        }
        /**
         * Deletes unit
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @returns {boolean | undefined} False if unit does not exist, nothing otherwise
         */
    deleteUnit(className, unitName) {
            const classroom = className.toLowerCase();
            if (!this.unitExists(classroom, unitName.toLowerCase())) return false;

            delete this.db.classes[classroom].units[unitName.toLowerCase()];
            this.saveAll();
        }
        /**
         * Gets all units by class name
         * @param {string} className Name of class
         * @returns {boolean | array} False if fails otherwise will return array of units
         */
    getAllUnits(className) {
            const classroom = className.toLowerCase();

            if (!this.classExists(classroom)) return false;

            return Object.values(this.db.classes[classroom].units);
        }
        /**
         * Gets unit by class name and unit name
         * @param {string} className Name of class
         * @param {string} unitName Name of unit
         * @returns {boolean | object} False if fails or object of unit
         */
    getUnit(className, unitName) {
            const classroom = className.toLowerCase();

            if (!this.unitExists(className, unitName)) return false;

            return this.db.classes[classroom].units[unitName.toLowerCase()];
        }
        /*
///////////////// BETA METHODS ////////////////////
    */
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