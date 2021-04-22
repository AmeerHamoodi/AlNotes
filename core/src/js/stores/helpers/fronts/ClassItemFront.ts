import { ClassItemFrontInterface } from "./interfaces";

class ClassItemFront implements ClassItemFrontInterface {
    name: string;
    link: string;

    constructor(params: { name: string, link: string }) {
        this.name = params.name;
        this.link = params.link;
    }
}

export default ClassItemFront;