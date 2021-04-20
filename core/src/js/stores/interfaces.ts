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
    createClass: (className: string) => void
};

export { ClassesStoreInterface };