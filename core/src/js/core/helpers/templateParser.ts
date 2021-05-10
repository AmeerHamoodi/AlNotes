/**
 * Template example:
 * **Name of item**:
 *  - **Structure:**
 *      - stuff
 *  - **Function:**
 *      - stuff
 */

/**
 * Template object example:
 *
 */

import { RangeStatic } from "quill";
import { Quill } from "react-quill";

interface defaulTemplateStatic {
    /**
     * Item Structure Function
     * **Name of item**:
     *  - **Structure:**
     *      - stuff
     *  - **Function:**
     *      - stuff
     * @param quill {Quill} Quill object
     */
    ISF: (quill: Quill) => void;
}

const defaultTemplates = {
    /**
     * Item Structure Function
     * **Name of item**:
     *  - **Structure:**
     *      - stuff
     *  - **Function:**
     *      - stuff
     * @param quill {Quill} Quill object
     */
    ISF: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();

        let oldSelection = currentSelection;
        quill.format("header", 3);
        quill.insertText(currentSelection.index, "Name of item:\n");
        quill.format("header", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Structure:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.format("indent", "-1");
        quill.insertText(currentSelection.index, "Function:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "\n");
        quill.format("indent", "-1");
        quill.format("list", false);

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Name of item".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Name of item".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Definition
     * **Name of item:**
     *  - **Definition:** some stuff
     * @param quill Quill object
     */
    DEF: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;
        quill.format("header", 3);
        quill.insertText(currentSelection.index, "Name of item:\n");
        quill.format("header", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Definition:");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.insertText(currentSelection.index, "\n");
        quill.format("list", false);

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Name of item".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Name of item".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Process:
     * **Name of process:**
     *  - **Description:** some stuff
     *  - **Steps:**
     *      a. Step content
     * @param quill Quill object
     */
    PROC: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;
        quill.format("header", 3);
        quill.insertText(currentSelection.index, "Name of process:\n");
        quill.format("header", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Description:");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.insertText(currentSelection.index, "\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Steps:\n");
        quill.format("bold", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.format("list", "ordered");
        quill.insertText(currentSelection.index, "");

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Name of process".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Name of process".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Theory Evidence Description
     * **Name of theory:**
     *  - **Evidence:**
     *      - some evidence
     *  - **Details:**
     *      - Some details
     * @param quill Quill object
     */
    TED: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;
        quill.format("header", 3);
        quill.insertText(currentSelection.index, "Name of theory:\n");
        quill.format("header", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Evidence:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", true);
        quill.format("indent", "-1");
        quill.insertText(currentSelection.index, "Details:\n");
        quill.format("bold", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "");

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Name of theory".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Name of theory".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Concept sub concept
     * **Concept name:**
     *  - **Sub concept:**
     *      -
     * @param quill
     */
    CS: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;
        quill.format("header", 3);
        quill.insertText(currentSelection.index, "Name of concept:\n");
        quill.format("header", false);

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Sub-concept name:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Name of concept".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Name of concept".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Sub concept
     * - **Sub concept:**
     *      -
     * @param quill
     */
    SC: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;

        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Sub-concept name:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");

        quill.focus();
        quill.setSelection(
            oldSelection.index,
            oldSelection.length + "Sub-concept name".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index,
                    oldSelection.length + "Sub-concept name".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Example:
     *  - **Example [details]:**
     *      -
     * @param quill
     */
    EX: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;

        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Example [details]:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");

        quill.focus();
        quill.setSelection(
            oldSelection.index + 9,
            oldSelection.length + "details".length
        );

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(
                    oldSelection.index + 9,
                    oldSelection.length + "details".length
                );
                quill.off("selection-change", null);
            }
        );
    },
    /**
     * Figure caption:
     *  - **Figure:**
     *      -
     *  - **Caption:**
     *      -
     * @param quill
     */
    FC: (quill: Quill) => {
        quill.focus();
        let currentSelection: RangeStatic = quill.getSelection();

        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Figure:\n");

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "\n");
        let oldSelection = currentSelection;

        quill.focus();
        currentSelection = quill.getSelection();
        quill.format("bold", true);
        quill.format("indent", "-1");
        quill.insertText(currentSelection.index, "Caption:\n");
        quill.format("indent", "+1");

        quill.focus();
        quill.setSelection(oldSelection.index, oldSelection.length);

        quill.on(
            "selection-change",
            (range: RangeStatic, oldRange: RangeStatic) => {
                quill.setSelection(oldSelection.index, oldSelection.length);
                quill.off("selection-change", null);
            }
        );
    }
};

export default defaultTemplates;
export { defaulTemplateStatic };
