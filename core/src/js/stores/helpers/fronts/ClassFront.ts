import { ClassFrontInterface } from "./interfaces";

interface ConstParams {
    name: string;
    archived: boolean;
}

export default class ClassFront implements ClassFrontInterface {
    name: string;
    link: string;
    openMessage: string;
    deleteMessage: string;
    archived: boolean;

    constructor(data: ConstParams) {
        this.name = data.name;
        this.link = `/class/${data.name}`;
        this.archived = data.archived;
        this.openMessage = "Open Class";
        this.deleteMessage = "Delete Class";
    }
}

export { ConstParams };
