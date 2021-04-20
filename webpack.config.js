const { resolve } = require("path");

module.exports = {
    entry: "./core/src/js/main.tsx",
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: "awesome-typescript-loader"
        }]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    output: {
        filename: "bundle.js",
        path: resolve(__dirname, "./dist/public/js")
    },
    mode: "development"
};