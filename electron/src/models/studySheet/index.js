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
            this.db = JSON.parse(data);
        else this._createStudySheetFromStoredNotes(datastorage.db);
    }
    /**
     * Creates study sheet from notes and organizes them by class
     * @param {datastorage.db} DB Database property from datastorage object
     */
    _createStudySheetFromStoredNotes(DB) {
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
                    const content =
                        note.content.length > 0
                            ? JSON.parse(note.content)
                            : { ops: [] };

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
                            // This basically means that the actual header is merged with some other text and is split via a "\n"
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
     * Creates/updates studysheet based on content that was sent from studysheet
     * @param {string} className Name of class
     * @param {object} content Study note content (quill export)
     */
    _createStudySheetFromStudySheetContent(className, content) {
        const parsed = JSON.parse(content);
        const total = [];

        let current = { header: null, content: [] };

        parsed.ops.forEach((item, index) => {
            const next =
                index + 1 < parsed.ops.length ? parsed.ops[index + 1] : {};

            if (
                typeof next.attributes !== "undefined" &&
                typeof next.attributes.header !== "undefined" &&
                (next.attributes.header == 1 || next.attributes.header == 2)
            ) {
                if (!!current.header) total.push(current);

                // Check if item is "weird formatted"
                // This basically means that the actual header is merged with some other test and is split via a "\n"
                // This part fixes that

                const nSplitArray = item.insert.split("\n");

                const realHeader =
                    nSplitArray.filter((textContent) => textContent.length > 0)
                        .length > 1
                        ? nSplitArray[nSplitArray.length - 1]
                        : item.insert;

                current = {
                    header: realHeader + "\n",
                    content: []
                };
                parsed.ops.splice(index + 1, 1);
            } else {
                if (!!current.header) current.content.push(item);

                if (index === parsed.ops.length - 1) total.push(current);
            }
        });

        this.db[className.toLowerCase()].studyNoteData = total;
        this.save();
    }

    /**
     * Saves current db object to storage
     */
    save() {
        store.set("studySheet", JSON.stringify(this.db));
    }
    /**
     * Gets studysheet by class name
     * @param {string} className Name of class
     * @returns {boolean | object} False if fails studynote if successful
     */
    getClassStudySheet(className) {
        if (typeof className !== "string") return false;

        if (typeof this.db[className.toLowerCase()].studyNoteData !== "object")
            return false;

        return this.db[className.toLowerCase()].studyNoteData;
    }

    updateStudySheet(className, newData) {
        if (typeof className !== "string" || typeof newData !== "string")
            return false;

        if (typeof this.db[className.toLowerCase()].studyNoteData !== "object")
            return false;

        this._createStudySheetFromStudySheetContent(className, newData);

        return true;
    }
}

module.exports = StudySheetStorage;
