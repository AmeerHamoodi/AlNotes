import { UnitFrontInterface } from "./interfaces";

interface UnitFrontParams {
    name: string
}

export default class UnitFront implements UnitFrontInterface {
    name: string;
    link: string;
    openMessage: string;
    deleteMessage: string;

    constructor(data: UnitFrontParams, className: string) {
        this.name = data.name;
        this.link = `/class/${className}/unit/${data.name}`;
        this.deleteMessage = "Delete note";
        this.openMessage = "Open note";
    }
};

export { UnitFrontParams };

