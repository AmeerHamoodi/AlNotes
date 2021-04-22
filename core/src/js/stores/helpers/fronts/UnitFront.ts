import { UnitFrontInterface } from "./interfaces";

interface UnitFrontParams {
    name: string
}

export default class UnitFront implements UnitFrontInterface {
    name: string;
    link: string;

    constructor(data: UnitFrontParams, className: string) {
        this.name = data.name;
        this.link = `/class/${className}/unit/${data.name}`;
    }
};

export { UnitFrontParams };

