import { UnitFrontInterface } from "./interfaces";

interface UnitFrontParams {
    name: string
}

export default class UnitFront implements UnitFrontInterface {
    name: string;
    link: string;
    classroomName: string;

    constructor(data: UnitFrontParams) {
        this.name = data.name;
        this.classroomName = ""; //Get only property
        this.link = `/class/${this.classroomName}/unit/${data.name}`;
    }
    //A hack that basically updates the link with the accurate classroomName
    set className(data: string) {
        this.classroomName = data;
        this.link = `/class/${this.classroomName}/unit/${this.name}`;
    }
};

export { UnitFrontParams };

