const path = require('path');
const fs = require('fs');
const gen = require('dts-bundle-generator');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

class DtsBundleGeneratorPlugin{
  apply(compiler) {
    compiler.hooks.done.tap('DtsBundleGeneratorPlugin', function(){
      const dTsFiles = fs.readdirSync('./dist')
        .filter(it => it.endsWith('.d.ts'));
      const latestDTsFileMTime = dTsFiles
        .map(file => fs.statSync(`./dist/${file}`))
        .map(stats => stats.mtimeMs)
        .sort((a, b) => b - a)[0];

      const inPath = './dist/index.d.ts';
      const outFile = 'indexout.dec';
      const outPath = `./dist/${outFile}`;
      if (latestDTsFileMTime) { // test if file needs an update
        const statsOut = fs.statSync(outPath);
        if (statsOut.mtimeMs >= latestDTsFileMTime) {
          return;
        }
      }

      const result = gen.generateDtsBundle([{
        filePath: inPath,
        output: {
          noBanner: true,
        }
      }]);

      const output = result[0];
      const newOutput = output.replace(/export /g, '');
      fs.writeFileSync(outPath, newOutput);
    });
  };
}

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    new DtsBundleGeneratorPlugin(),
    new NodePolyfillPlugin(),
  ],
};
