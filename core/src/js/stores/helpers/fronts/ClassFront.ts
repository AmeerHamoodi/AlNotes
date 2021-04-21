import { ClassFrontInterface } from "./interfaces";

interface ConstParams {
    name: string
};

export default class ClassFront implements ClassFrontInterface {
    name: string;
    link: string;
    openMessage: string;
    deleteMessage: string;

    constructor(data: ConstParams) {
        this.name = data.name;
        this.link = `/class/${data.name}`;
        this.openMessage = "Open Class";
        this.deleteMessage = "Delete Class";
    }
}

export { ConstParams };