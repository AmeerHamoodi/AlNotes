interface ClassFrontInterface {
    name: string,
    link: string,
    openMessage: string,
    deleteMessage: string,
    deleteFunction?: () => void
};

interface UnitFrontInterface {
    name: string,
    link: string,
    deleteFunction?: () => void
    icon?: string | "folder" | "book" | "flask" | "users"
};

interface ClassItemFrontInterface {
    name: string,
    link: string,
    deleteFunction?: () => void
};

interface NoteFrontInterface {
    name: string,
    id: string,
    link: string,
    className?: string,
    publicUnitName?: string,
    deleteFunction?: () => void
    
}

export { ClassFrontInterface, UnitFrontInterface, ClassItemFrontInterface, NoteFrontInterface };