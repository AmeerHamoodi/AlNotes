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
    createUnit: (className: string, unitName: string) => void
}

export { ClassesStoreInterface, UnitsStoreInterface };