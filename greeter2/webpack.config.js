var path = require("path");
var webpack = require("webpack");

var cfg = {
  devtool: "source-map",
  entry: "./dist/greeter.js",
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js",
    libraryTarget: 'var',
    library: 'Greeter'    
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  }
};

module.exports = cfg;