const Store = require("electron-store");

const LinkedList = require("./LinkedList");
const LinkedListItem = require("./LinkedListItem");

const DataStorage = require("../DataStorage");

const datastorage = new DataStorage();
datastorage._init();

const store = new Store();

class StudySheetStorage {
    constructor() {
        this.db = {};
    }

    _init() {
        const data = store.get("studySheet");
        if (typeof data !== "undefined") this.db = data;
        else this._createStudySheetFromStoredNotes(datastorage.db);
    }
    /**
     * Creates study sheet from notes and organizes them by class
     * @param {datastorage.db} DB Database property from datastorage object
     */
    _createStudySheetFromStoredNotes(DB) {
        // Generate study sheet from notes, lol this should be fun
        // Well that wasn't that bad, just can't wait to see how slow this is with more than 3 notes
        const classes = DB.classes;

        const classStudyNotes = {};

        for (let classKey in classes) {
            const classData = classes[classKey];
            const units = classData.units;

            let total = [];

            for (let unitKey in units) {
                const unit = units[unitKey];
                const notes = unit.notes;

                for (let noteKey in notes) {
                    const note = notes[noteKey];
                    const content = JSON.parse(note.content);

                    let current = { header: null, content: [] };

                    content.ops.forEach((item, index) => {
                        const next =
                            index + 1 < content.ops.length
                                ? content.ops[index + 1]
                                : {};
                        if (
                            typeof next.attributes !== "undefined" &&
                            typeof next.attributes.header !== "undefined" &&
                            (next.attributes.header == 1 ||
                                next.attributes.header == 2)
                        ) {
                            total.push(current);
                            current = {
                                header: item.insert + "\n",
                                content: []
                            };
                            content.ops.splice(index + 1, 1);
                        } else {
                            if (!!current.header) current.content.push(item);
                        }
                    });
                    console.log(current);
                }
            }
            classStudyNotes[classKey] = {};
            classStudyNotes[classKey].studyNoteData = total;
        }

        this.db = classStudyNotes;
        this.save();
    }

    /**
     * Saves current db object to storage
     */
    save() {
        store.set("studySheet", this.db);
    }

    getClassStudySheet(className) {
        if (typeof className !== "string") return false;

        if (typeof this.db.studyNoteData[className] !== "object") return false;

        return this.db.studyNoteData[className];
    }
}

module.exports = StudySheetStorage;
