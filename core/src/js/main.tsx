import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Update from "./components/Update";
import "semantic-ui-css/semantic.min.css";

declare global {
  interface Window {
    jQuery: any;
    $: any;
    katex: any;
    mathquill4quill: any;
    MathQuill: any;
  }
}

window.jQuery = require("jquery");
window.$ = require("jquery");

const { remote } = window.require("electron");

if (remote.process.env === "TESTING") window.confirm = () => true;

ReactDOM.render(<App />, document.getElementById("app"));
ReactDOM.render(<Update />, document.getElementById("update"));
