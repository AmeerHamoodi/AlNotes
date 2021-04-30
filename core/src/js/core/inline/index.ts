/**
 * Math JAX:
 * User will hit CTRL+SHIFT+M
 * Turn where they're typing into highlighted section with color blue
 * Esc exits math jax
 * Enter evaluates content they've been writing and replaces it with the formatted version
 * 
 * OR
 * 
 * Inline input created (styled in a custom fashion)
 */

 import { Quill } from "react-quill";
 import { RangeStatic, DeltaOperation } from "quill";

type evaluationKeys = {
    mathJAX?: boolean
}

type DeltaStatic = {
    ops: DeltaOperation[]
}

interface InlineStatic {
    evaluation: evaluationKeys;
    evaluateGeneral: () => void;
    initializeSelector: () => void,
    selectMath: () => void
}

class Inline implements InlineStatic {
    private currentContent:string;
    private quill:Quill;

    public evaluation:evaluationKeys;

    constructor(core:Quill) {
        this.evaluation = {
            mathJAX: false
        };
        this.quill = core;
        this.currentContent = "";
    }


    //LISTENERS
    

    //EVALUATORS

    //PRIVATE EVALS


    //PUBLIC EVALS
    public evaluateGeneral() {
        switch(true) {
            case this.evaluation.mathJAX:
                console.log(window.katex);
                console.log(window.katex.renderToString(this.currentContent));

                const node = Array.from(document.querySelectorAll("#app .quill .ql-cotainer.ql-snow .ql-editor p"))
                    .find(el => {
                        console.log(el);
                        return el.textContent === this.currentContent
                    });
                
                console.log(node);

                const katex = window.katex.render(this.currentContent, node);

                this.evaluation.mathJAX = false;
                this.removeListeners();
                break;
        }
    }

    //SELECTORS

    private handleTextChange(delta: any, oldDelta: any) {
        console.log(delta, oldDelta, `Insert on first ops delta: ${typeof delta.ops[0].insert !== "undefined"}`);

        this.currentContent += typeof delta.ops[delta.ops.length - 1].insert === "string" ? delta.ops[delta.ops.length - 1].insert : ""; 

        this.currentContent = typeof delta.ops[delta.ops.length - 1].delete !== "undefined" ? 
        this.currentContent.slice(0, this.currentContent.length - 1) : this.currentContent;

        console.log(this.currentContent);
    }

    private handleSelectionChange() {
        this.currentContent = "";
    }

    private removeListeners() {
        this.quill.off("text-change", this.handleTextChange);
        this.quill.off("selection-change", this.handleSelectionChange);
    }


    public initializeSelector() {
        this.quill.on("selection-change", () => {
            this.handleSelectionChange();
        })

        this.quill.on("text-change", (delta: any, oldDelta: any, source) => {
            this.handleTextChange(delta, oldDelta)
        });
    }


    

    public selectMath() {
        this.evaluation.mathJAX = true;
    }
};

export default Inline;

export { InlineStatic };