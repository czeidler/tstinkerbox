const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const WebpackBuildLinkedPackages = require("webpack-build-linked-packages");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.ttf$/,
        use: ['file-loader']
      },
      {
        test: /\.dec$/i,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['typescript'],
    }),
    new WebpackBuildLinkedPackages(),
    new NodePolyfillPlugin(),
  ],
};
