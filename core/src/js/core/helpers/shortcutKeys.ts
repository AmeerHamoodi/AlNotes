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

import { RangeStatic, KeyboardStatic, Key } from "quill";
import Inline, { InlineStatic } from "../inline/";

type staticShortCut = {
    shortcut: {
        shortKey?: boolean,
        shiftKey?: boolean,
        key: string | number
    },
    cb: (range?: RangeStatic, context?: any, inlineHandler?:InlineStatic) => void
}


const shortcutFunctions: staticShortCut[] = [
    /** CTRL+SHIFT+S strikethrough */
    {
        shortcut: {
            shortKey: true,
            shiftKey: true,
            key: "S"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.format("strike", !context.format.strike);
        }
    },
    /** CTRL+H H1 */
    {
        shortcut: {
            shortKey: true,
            key: "H"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.format("header", context.format.header == 1 ? false : 1);
        }
    },
    /** CTRL+SHIFT+H H2 */
    {
        shortcut: {
            shortKey: true,
            shiftKey: true,
            key: "H"
        },
        cb: function (range: RangeStatic, context: any) {
            this.quill.format("header", context.format.header == 2 ? false : 2);
        }
    },
    /** CTRL+SHIFT+M
     * Enables math watch, i.e., start typing in MathJAX
     * Hit enter to execute and Esc to stop
     */
    {
        shortcut: {
            shortKey: true,
            shiftKey: true,
            key: "M"
        },
        cb: function(range: RangeStatic, context: any, inlineHandler: InlineStatic) {
            inlineHandler.selectMath();
            inlineHandler.initializeSelector();
        }
    },
    {
        shortcut: {
            key: 13
        },
        cb: function (range: RangeStatic, context: any, inlineHandler: InlineStatic) {
            console.log("evaluating")
            inlineHandler.evaluateGeneral();
        }
    }
]

const registerAllShortcuts = (keyboard: KeyboardStatic, inlineHandler: InlineStatic) => {

    shortcutFunctions.forEach((item: staticShortCut) => {
        if(item.shortcut.key == "M") {
            keyboard.addBinding(item.shortcut, function (range: RangeStatic, context: any) {
                const cb = item.cb;
                const attachedCb = cb.bind(this);
                
                attachedCb(range, context, inlineHandler);
            });
        } else {
            keyboard.addBinding(item.shortcut, item.cb);
        }
    });
};

/** See: https://github.com/zenoamaro/react-quill/issues/22#issuecomment-128286775 */
const patchListeners = (inlineHandler: InlineStatic) => {
    document.getElementsByClassName("ql-editor")[0].addEventListener("keyup", (e: KeyboardEvent) => {
        if(e.code == "Enter"){
            console.log("evaluating")
            inlineHandler.evaluateGeneral();
        }
    })
}


export default registerAllShortcuts;
export { staticShortCut, patchListeners };
