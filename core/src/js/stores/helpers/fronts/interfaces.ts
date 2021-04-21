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
}

export { ClassFrontInterface, UnitFrontInterface };