import { Quill } from "react-quill";

//CONFIGS
import quillToolbar, { quillToolbarType } from "./config/toolbar";
import formats from "./config/formats";


//INTERFACES AND TYPES
interface Modules {
    syntax: boolean,
    toolbar: quillToolbarType
}

interface CoreInterface {
    modules: Modules,
    formats: string[],
    coreEditor: Quill
}

class Core implements CoreInterface {
    private core: Quill;
    private toolbar: quillToolbarType = quillToolbar;
    private canStart: boolean = false;

    public modules: Modules = {
        toolbar: quillToolbar,
        syntax: true
    };
    public formats: string[] = formats;

    set coreEditor(q: Quill) {
        this.core = q;
        this.canStart = true;
    }
};

export default Core;

export { CoreInterface };