const conventionalRecommendedBump = require('conventional-recommended-bump');
const chalk = require('chalk');
const figures = require('figures');
const fs = require('fs');
const { version } = require('../package.json');
const packageFile = require('../package.json');

const getVersion = (appendage) => new Promise(((resolve, reject) => {
  conventionalRecommendedBump({
    preset: 'angular',
  }, (error, recommendation) => {
    if (error) {
      reject(error);
    }

    const { releaseType } = recommendation;
    console.log(`${chalk.cyan(figures.info)} Release type: ${recommendation.releaseType}`);

    let major = Number(version[0]);
    let minor = Number(version[2]);
    let patch = Number(version[4]);

    switch (releaseType) {
    case 'major':
      major += 1;
      break;
    case 'minor':
      minor += 1;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      throw new Error(`${chalk.red(figures.cross)} Invalid releaseType: ${releaseType}`);
    }

    let newVersion = `${major}.${minor}.${patch}`;

    if (appendage) {
      newVersion += appendage;
    }

    packageFile.version = newVersion;

    fs.writeFile(`${__dirname}/../package.json`, JSON.stringify(packageFile, null, 4), (err) => {
      if (err) {
        reject(new Error(`${chalk.red(figures.cross)} Could not update package.json: ${err.message}`));
      }
      console.log(`${chalk.green(figures.tick)} Updating version from ${version} to ${newVersion}`);

      resolve(newVersion);
    });
  });
}));

module.exports = getVersion;
