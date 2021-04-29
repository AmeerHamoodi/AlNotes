import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

declare global {
    interface Window {
        jQuery: any;
        $: any;
        katex: any;
    }
}

window.jQuery = window.require("jquery");
window.$ = window.require("jquery");

const { remote } = window.require("electron");

if (remote.process.env === "TESTING") window.confirm = () => true;

ReactDOM.render(<App />, document.getElementById("app"));