/**
 * Current shortcut keys:
 * Bold: Ctrl+B (default)
 * Italic: Ctrl+I
 * Underline: Ctrl+U
 * Save: Ctrl+S (note defined here for obvious reasons)
 * Strikethrough: Ctrl+Shift+S
 * H1: Ctrl+H
 * H2: Ctrl+Shift+H
 * Subcript: Ctrl+Shift+_
 * Superscript: Ctrl+Shift++
 * Remove selected formating: CTRL+`
 * Code block: CTRL+SHIFT+Q
 * Shift alignment: LEFT -> CENTER -> RIGHT | CTRL+SHIFT+A
 *                   ^----------------------
 */

import { RangeStatic, KeyboardStatic, Key } from "quill";
import { Quill } from "react-quill";
import { toJS } from "mobx";
import { CoreInterface } from "../index";
import defaultTemplates from "./templateParser";

type staticShortCut = {
    func: keyof typeof shortcutFunctionsDictionary;
    keyData: Key;
};

type shortCutFunction = (range?: RangeStatic, context?: any) => void;

interface templatesViewInt {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

interface shortcutFunctionsInterface {
    strike: (range: RangeStatic, context: any) => void;
    header1: (range: RangeStatic, context: any) => void;
    header2: (range: RangeStatic, context: any) => void;
    super: (range: RangeStatic, context: any) => void;
    sub: (range: RangeStatic, context: any) => void;
    removeFormat: (range: RangeStatic, context: any) => void;
    codeBlock: (range: RangeStatic, context: any) => void;
    align: (range: RangeStatic, context: any) => void;
}

const shortcutFunctionsDictionary = {
    strike: function (range: RangeStatic, context: any) {
        this.quill.format("strike", !context.format.strike);
    },
    header1: function (range: RangeStatic, context: any) {
        this.quill.format("header", context.format.header == 1 ? false : 1);
    },
    header2: function (range: RangeStatic, context: any) {
        this.quill.format("header", context.format.header == 2 ? false : 2);
    },
    super: function (range: RangeStatic, context: any) {
        this.quill.format(
            "script",
            context.format.script == "super" ? null : "super"
        );
    },
    sub: function (range: RangeStatic, context: any) {
        this.quill.format(
            "script",
            context.format.script == "sub" ? null : "sub"
        );
    },
    removeFormat: function (range: RangeStatic, context: any) {
        this.quill.removeFormat(range);
    },
    codeBlock: function (range: RangeStatic, context: any) {
        this.quill.format(
            "code-block",
            context.format.codeBlock ? false : true
        );
    },
    align: function (range: RangeStatic, context: any) {
        switch (context.format.align) {
            case "left":
                this.quill.format("align", "center");
                break;
            case "center":
                this.quill.format("align", "right");
                break;
            case "right":
                this.quill.format("align", "");
                break;
            default:
                this.quill.format("align", "center");
                break;
        }
    }
};
const templatesView: templatesViewInt[] = [];

const registerAllShortcuts = (
    keyboard: KeyboardStatic,
    shortCuts: staticShortCut[],
    core: CoreInterface
) => {
    shortCuts.forEach((item: staticShortCut) => {
        const realItem = toJS(item);
        keyboard.addBinding(
            realItem.keyData,
            shortcutFunctionsDictionary[realItem.func]
        );
    });

    let quill: Quill = core.coreEditor;

    templatesView.push({
        text: "Item Structure Function",
        example: `
            **Name of item:**
                - **Structure:**
                    - 
                - **Function:**
                    -
            `,
        func: () => {
            defaultTemplates.ISF(quill);
        },
        value: "ISF"
    });
    templatesView.push({
        text: "Definition",
        example: `
        **Name of item:**
            - **Definition:** 
        `,
        func: () => {
            defaultTemplates.DEF(quill);
        },
        value: "DEF"
    });
    templatesView.push({
        text: "Process",
        example: `
        **Name of process:**
            - **Description:**
                -
            - **Steps:**
                a.
        `,
        func: () => {
            defaultTemplates.PROC(quill);
        },
        value: "PROC"
    });
    templatesView.push({
        text: "Theory Evidence Details",
        example: `
        **Name of theory:**
        - **Evidence:**
            - some evidence
        - **Details:**
            - Some details
        `,
        func: () => {
            defaultTemplates.TED(quill);
        },
        value: "TED"
    });
    templatesView.push({
        text: "Concept Sub-Concept",
        example: `
        **Concept name:**
            - **Sub concept:**
                -
        `,
        func: () => {
            defaultTemplates.CS(quill);
        },
        value: "CS"
    });
    templatesView.push({
        text: "Sub-Concept",
        example: `
            - **Sub concept:**
                -
        `,
        func: () => {
            defaultTemplates.SC(quill);
        },
        value: "SC"
    });
    templatesView.push({
        text: "Example",
        example: `
            - **Example [details]:**
                -
        `,
        func: () => {
            defaultTemplates.EX(quill);
        },
        value: "EX"
    });
    templatesView.push({
        text: "Figure Caption",
        example: `
            - **Figure:**
                -
            - **Caption:**
                -
        `,
        func: () => {
            defaultTemplates.FC(quill);
        },
        value: "FC"
    });

    core.attachTemplates(templatesView);
};

export default registerAllShortcuts;
export { staticShortCut };
