const { resolve } = require("path");

module.exports = {
  entry: "./core/src/js/main.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "./dist/public/js"),
  },
  mode: "development",
};
