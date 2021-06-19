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
        if (typeof data !== "undefined" && process.env.RESET_STUDYSHEET !== "1")
            this.db = data;
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
                            if (!!current.header) total.push(current);

                            // Check if item is "weird formatted"
                            // This basically means that the actual header is merged with some other test and is split via a "\n"
                            // This part fixes that

                            const nSplitArray = item.insert.split("\n");

                            const realHeader =
                                nSplitArray.filter(
                                    (content) => content.length > 0
                                ).length > 1
                                    ? nSplitArray[nSplitArray.length - 1]
                                    : item.insert;

                            current = {
                                header: realHeader + "\n",
                                content: []
                            };
                            content.ops.splice(index + 1, 1);
                        } else {
                            if (!!current.header) current.content.push(item);
                        }
                    });
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
        console.log(this.db);
        if (typeof className !== "string") return false;

        if (typeof this.db[className].studyNoteData !== "object") return false;

        return this.db[className].studyNoteData;
    }
}

module.exports = StudySheetStorage;
