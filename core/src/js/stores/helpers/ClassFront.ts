import { ClassFrontInterface } from "./interfaces";

interface ConstParams {
    name: string,
    id: string
};

export default class ClassFront implements ClassFrontInterface {
    name: string;
    link: string;
    openMessage: string;
    deleteMessage: string;
    id: string;

    constructor(data: ConstParams) {
        this.name = data.name;
        this.link = `/class/${data.id}`;
        this.openMessage = "Open Class";
        this.deleteMessage = "Delete Class";
        this.id = data.id;
    }
}

export { ConstParams };