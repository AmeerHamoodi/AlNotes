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
    createClassItem: (className: string, type: string | "textbook" | "lab" | "meeting", data: ClassItem) => void
}

export { ClassesStoreInterface, UnitsStoreInterface, ClassItemsInterface, ClassItem };