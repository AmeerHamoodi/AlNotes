const stringSimilarity = require("string-similarity");

const search = (items, data) => {
    if (data.length <= 3) {
        const arrCompar = data.toLowerCase().split("");
        const ret = [];
        items.forEach(item => {
            if (arrCompar.includes(item.name[0].toLowerCase() ||
                arrCompar.includes(item.name[1].toLowerCase()) ||
                arrCompar.includes(item.name[2].toLowerCase()))) {
                ret.push(item);
            }
        });

        return ret;
    } else {
        const ret = [];
        items.forEach(item => {
            if (stringSimilarity.compareTwoStrings(item.name, data) >= 0.35) {
                ret.push(item);
            }
        });

        return ret;
    }

};

export default search;