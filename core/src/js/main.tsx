import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

declare global {
    interface Window {
        jQuery: any;
        $: any;
    }
}

window.jQuery = window.require("jquery");
window.$ = window.require("jquery");

ReactDOM.render(<App />, document.getElementById("app"));