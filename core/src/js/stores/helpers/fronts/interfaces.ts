interface ClassFrontInterface {
    name: string;
    link: string;
    openMessage: string;
    deleteMessage: string;
    deleteFunction?: () => void;
    archiveFunction?: () => void;
    archived: boolean;
}

interface UnitFrontInterface {
    name: string;
    link: string;
    deleteFunction?: () => void;
    exportFunction?: () => void;
    icon?: string | "folder" | "book" | "flask" | "users";
}

interface ClassItemFrontInterface {
    name: string;
    link: string;
    deleteFunction?: () => void;
}

interface NoteFrontInterface {
    name: string;
    id: string;
    link: string;
    className?: string;
    publicUnitName?: string;
    deleteFunction?: () => void;
}

export {
    ClassFrontInterface,
    UnitFrontInterface,
    ClassItemFrontInterface,
    NoteFrontInterface
};
