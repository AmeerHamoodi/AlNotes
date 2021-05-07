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

import { RangeStatic, KeyboardStatic, Key, Quill } from "quill";
import { toJS } from "mobx";
import defaultTemplates from "./templateParser";

type staticShortCut = {
    func: keyof typeof shortcutFunctionsDictionary,
    keyData: Key
}

type shortCutFunction = (range?: RangeStatic, context?: any) => void;

interface templatesViewInt {
    name: string;
    example: string;
    func: () => void;
}


interface shortcutFunctionsInterface {
    strike: (range: RangeStatic, context: any) => void,
    header1: (range: RangeStatic, context: any) => void,
    header2: (range: RangeStatic, context: any) => void,
    super: (range: RangeStatic, context: any) => void,
    sub: (range: RangeStatic, context: any) => void,
    removeFormat: (range: RangeStatic, context: any) => void,
    codeBlock: (range: RangeStatic, context: any) => void,
    align: (range: RangeStatic, context: any) => void,
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
        this.quill.format("script", context.format.script == "super" ? null : "super");
    },
    sub: function (range: RangeStatic, context: any) {
        this.quill.format("script", context.format.script == "sub" ? null : "sub");
    },
    removeFormat: function (range: RangeStatic, context: any) {
        this.quill.removeFormat(range);
    },
    codeBlock: function (range: RangeStatic, context: any) {
        this.quill.format("code-block", context.format.codeBlock ? false : true);
    },
    align: function (range: RangeStatic, context: any) {
        switch(context.format.align) {
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
}
const templatesView: templatesViewInt[] = [];

const registerAllShortcuts = (keyboard: KeyboardStatic, shortCuts: staticShortCut[]) => {
    shortCuts.forEach((item: staticShortCut) => {
        const realItem = toJS(item)
        console.log(realItem)
        keyboard.addBinding(realItem.keyData, shortcutFunctionsDictionary[realItem.func]);
    });

    let quill: Quill;

    keyboard.addBinding({
        key: 83,
        altKey: true
    }, function (range: RangeStatic, context: any) {
        quill = this.quill;
        defaultTemplates.ISF(this.quill);
    });
    keyboard.addBinding({
        key: 68,
        altKey: true
    }, function (range: RangeStatic, context: any) {
        defaultTemplates.DEF(this.quill);
    });
    keyboard.addBinding({
        key: 80,
        altKey: true
    }, function(range: RangeStatic, context: any) {
        defaultTemplates.PROC(this.quill);
    });
    keyboard.addBinding({
        key: 84,
        altKey: true
    }, function(range: RangeStatic, content: any) {
        defaultTemplates.TED(this.quill);
    });
    keyboard.addBinding({
        key: 67,
        altKey: true
    }, function(range: RangeStatic, content: any) {
        defaultTemplates.CS(this.quill);
    });
    keyboard.addBinding({
        key: 67,
        altKey: true,
        shiftKey: true
    }, function(range: RangeStatic, content: any) {
        defaultTemplates.SC(this.quill);
    });
    keyboard.addBinding({
        key: 69,
        altKey: true
    }, function(range: RangeStatic, content: any) {
        defaultTemplates.EX(this.quill);
    });
    keyboard.addBinding({
        key: 70,
        altKey: true
    }, function(range: RangeStatic, content: any) {
        defaultTemplates.FC(this.quill);
    });


    templatesView.push({
            name: "Item Structure Function",
            example: `
            **Name of item:**
                - **Structure:**
                    - 
                - **Function:**
                    -
            `,
            func: () => {
                defaultTemplates.ISF(quill);
            }
        });
    templatesView.push({
        name: "Definition",
        example: `
        **Name of item:**
            - **Definition:** 
        `,
        func: () => {
            defaultTemplates.DEF(quill)
        }
    });

    
}


export default registerAllShortcuts;
export { staticShortCut };
