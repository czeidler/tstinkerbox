const fs = require('fs');
const gen = require('dts-bundle-generator');

const dTsFiles = fs.readdirSync('./dist')
        .filter(it => it.endsWith('.d.ts'));
const latestDTsFileMTime = dTsFiles
  .map(file => fs.statSync(`./dist/${file}`))
  .map(stats => stats.mtimeMs)
  .sort((a, b) => b - a)[0];

const inPath = './dist/index.d.ts';
const outFile = 'indexout.dec';
const outPath = `./dist/${outFile}`;
if (latestDTsFileMTime && fs.existsSync(outPath)) { // test if file needs an update
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
