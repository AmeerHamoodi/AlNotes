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
 * 
 * TODOS:
 *  - Add better formula entering
 *      - I.E. not using the input box bc bad UX
 *      - Add shortcut key for formula
 */

import { KeyboardStatic, RangeStatic } from "quill";

type staticShortCut = {
    shortcut: {
        metaKey?: boolean,
        shiftKey?: boolean,
        key: string
    },
    cb: (range: RangeStatic, context: any) => void
}


const shortcutFunctions: staticShortCut[] = [
    /** CTRL+SHIFT+S strikethrough */
    {
        shortcut: {
            metaKey: true,
            shiftKey: true,
            key: "S"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.formatText(range, "strike", !context.format.strike);
        }
    },
    /** CTRL+H H1 */
    {
        shortcut: {
            metaKey: true,
            key: "H"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.formatText(range, "header", context.header == 1 ? false : 1);
        }
    },
    /** CTRL+SHIFT+H H2 */
    {
        shortcut: {
            metaKey: true,
            shiftKey: true,
            key: "H"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.formatText(range, "header", context.header == 2 ? false : 2);
        }
    }
]

const registerAllShortcuts = (keyboard: KeyboardStatic) => {
    shortcutFunctions.forEach((shortCutFunction: staticShortCut) => {
        keyboard.addBinding(shortCutFunction.shortcut, shortCutFunction.cb);
    });
};

export default registerAllShortcuts;
export { staticShortCut };
