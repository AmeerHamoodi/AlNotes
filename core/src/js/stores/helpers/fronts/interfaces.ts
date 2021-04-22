interface ClassFrontInterface {
    name: string,
    link: string,
    openMessage: string,
    deleteMessage: string
};

interface UnitFrontInterface {
    name: string,
    link: string,
    classroomName?: string,
    deleteFunction?: (className: string, unitName: string) => void
};

interface ClassItemFrontInterface {
    name: string,
    link: string,
    classroomName?: string,
    deleteFunction?: (className: string, itemName: string) => void
}

export { ClassFrontInterface, UnitFrontInterface, ClassItemFrontInterface };