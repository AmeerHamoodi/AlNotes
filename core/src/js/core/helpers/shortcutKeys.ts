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

type staticShortCut = {
    func: "strike" | "heading1" | "heading2" | "super" | "sub" | "removeFormat" | "codeBlock" | "align",
    keys: Key
}

type shortCutFunction = (range?: RangeStatic, context?: any) => void;


interface shortcutFunctionsInterface {
    strike: (range: RangeStatic, context: any) => void,
    heading1: (range: RangeStatic, context: any) => void,
    heading2: (range: RangeStatic, context: any) => void,
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
    heading1: function (range: RangeStatic, context: any) {
        this.quill.format("header", context.format.header == 1 ? false : 1);
    },
    heading2: function (range: RangeStatic, context: any) {
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

const registerAllShortcuts = (keyboard: KeyboardStatic, shortCuts: staticShortCut[]) => {
    shortCuts.forEach((item: staticShortCut) => {
        keyboard.addBinding(item.keys, shortcutFunctionsDictionary[item.func]);
    });
}


export default registerAllShortcuts;
export { staticShortCut };
