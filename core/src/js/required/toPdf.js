const converNoteToPdf = () => {
    let doc = new jspdf();
    const html = $(".ql-container.ql-snow").html();

    doc.fromHTML(html, 15, 15, {
        width: 170
    }, () => {
        doc.save($(".centered").text() + ".pdf")
    });
};

export default converNoteToPdf;