import { DeltaOperation } from "quill";

import { Quill } from "react-quill";

import Delta = require("quill-delta");

export interface StudySheetItem {
    header: string;
    content: DeltaOperation[];
}

const parseStudySheet = (items: StudySheetItem[], quill: Quill) => {
    items.slice().reverse();

    items.forEach((item: StudySheetItem) => {
        const headingDelta = new Delta();
        headingDelta.insert(item.header, {
            header: 2
        });

        const contentDelta = new Delta(item.content);

        const fullDelta = headingDelta.concat(contentDelta);

        quill.updateContents(fullDelta, "api");
    });
};

export default parseStudySheet;
