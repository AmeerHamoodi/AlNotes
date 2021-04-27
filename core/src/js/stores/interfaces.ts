import { NoteFrontInterface } from "./helpers/fronts/interfaces";

interface ClassesStoreInterface {
    classes: object[],
    classesLoaded: boolean,
    errorContent: {
        occured: boolean,
        data: any
    },
    _classListener: () => void,
    _errorListener: () => void,
    _handleError: (e: Error) => void,
    getClasses: () => void,
    createClass: (className: string) => void,
    deleteClass: (className: string) => void
};

interface UnitsStoreInterface {
    units: object[],
    unitsLoaded: boolean,
    errorContent: {
        occured: boolean,
        data: any
    },
    currentClass: string,
    _unitsListener: () => void,
    _errorListener: () => void,
    _handleError: (e: Error) => void,
    getUnits: (className: string) => void,
    createUnit: (className: string, unitName: string) => void,
    deleteUnit: (className: string, unitName: string) => void
};

type ClassItem = {
    name: string,
    link: string
}

interface ClassItemsInterface {
    errorContent: {
        occured: boolean,
        data: any
    },
    textbooks: ClassItem[],
    labs: ClassItem[],
    meetings: ClassItem[],
    contentLoaded: boolean,
    _errorListener: () => void,
    _handleError: (e: Error) => void,
    getClassContent: (className: string) => void,
    createClassItem: (className: string, type: string | "textbook" | "lab" | "meeting", data: ClassItem) => void,
    deleteClassItem: (className: string, type: string | "textbook" | "lab" | "meeting", name: string) => void
};

interface NotesStoreInterface {
    errorContent: {
        occured: boolean,
        data: any
    },
    notes: NoteFrontInterface[],
    notesLoaded: boolean,
    currentClass: string,
    _errorListener: () => void,
    _handleError: (e: Error) => void,
    getNotes: (className: string, unitName: string) => void,
    createNote: (className: string, unitName: string, noteName: string)=> void
}


type getNoteByIdResponse = {
    content: string;
    id: string;
    date: string;
    name: string;
}

interface NoteStoreInterface {
    errorContent: {
        occured: boolean,
        data: any
    },
    noteContent: string,
    noteId: string,
    noteLoaded: boolean,
    noteDate: string,
    noteName: string,
    unitName: string,
    className: string,
    _errorListener: () => void,
    _handleError: (e: Error) => void,
    getNote: (className: string, unitName: string, id: string) => void,
    saveNote: (className: string, unitName: string, id: string, content: string, name: string) => void
}


export { ClassesStoreInterface, UnitsStoreInterface, ClassItemsInterface, ClassItem, NotesStoreInterface, getNoteByIdResponse, NoteStoreInterface };