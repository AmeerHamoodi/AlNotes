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

import Quill, { RangeStatic } from "quill";

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
    ISF: (quill: Quill) => void
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
        let currentSelection: RangeStatic = quill.getSelection();
        let oldSelection = currentSelection;
        quill.format("header", 2);
        quill.insertText(currentSelection.index, "Name of item:\n");
        quill.format("header", false);

        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.insertText(currentSelection.index, "Structure:\n");
        
        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "Some stuff\n");

        currentSelection = quill.getSelection();
        quill.format("list", "bullet");
        quill.format("bold", true);
        quill.format("indent", "-1");
        quill.insertText(currentSelection.index, "Function:\n");

        currentSelection = quill.getSelection();
        quill.format("bold", false);
        quill.format("indent", "+1");
        quill.insertText(currentSelection.index, "Some stuff\n");
        quill.format("indent", "-1");
        quill.format("list", false);

        quill.setSelection(oldSelection.index, oldSelection.length + "Name of item".length);
    }
};

export default defaultTemplates;
export { defaulTemplateStatic }