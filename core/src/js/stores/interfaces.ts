interface ClassesStoreInterface {
    classes: object[],
    classesLoaded: boolean,
    errorContent: {
        occured: boolean,
        data: any
    },
    _classListener: () => void,
    getClasses: () => void,
    createClass: (className: string) => void
};

export { ClassesStoreInterface };