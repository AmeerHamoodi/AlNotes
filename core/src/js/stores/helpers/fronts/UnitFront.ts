import { UnitFrontInterface } from "./interfaces";

interface UnitFrontParams {
    name: string,
    id: string,
    className: string
}

export default class UnitFront implements UnitFrontInterface {
    name: string;
    link: string;

    constructor({name, id, className}: UnitFrontParams) {
        this.name = name;
        this.link = `/class/${className}/unit/${id}`;
    }
};

export { UnitFrontParams };

