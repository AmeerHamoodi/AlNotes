import { ClassItemFrontInterface } from "./interfaces";

class ClassItemFront implements ClassItemFrontInterface {
    name: string;
    link: string;

    constructor(selfName: string, link: string) {
        this.name = selfName;
        this.link = link;
    }
}

export default ClassItemFront;