export default class NoteFront {
    name: string;
    id: string;
    link: string;
    classroomName?: string;
    unitName?: string;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    set className(className: string) {
        this.classroomName = className;
        this.link = `/class/${this.classroomName}/unit/${this.unitName}/note/${this.id}`;
    }

    set publicUnitName(unitName: string) {
        this.unitName = unitName;
        this.link = `/class/${this.classroomName}/unit/${this.unitName}/note/${this.id}`;
    }
}