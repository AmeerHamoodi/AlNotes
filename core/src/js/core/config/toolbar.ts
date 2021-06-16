const quillToolbar = [
    [{ header: 1 }, { header: 2 }],
    ["bold", "italic", "underline", "strike"],
    ["code-block", "formula"],
    [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
    ],
    [{ direction: "rtl" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: ["", "center", "right", "justify"] }],
    ["clean"]
];

//Order of the toolbar content

type quillToolbarType = object | string[][];

export default quillToolbar;

export { quillToolbarType };
