const conventionalRecommendedBump = require('conventional-recommended-bump');

const cwd = process.cwd();

const fs = require('fs');

const packageFile = require(`${cwd}/package.json`);
const packageLockFile = require(`${cwd}/package-lock.json`);
const { promisify } = require('util');
const log = require('../logger');

const { version } = packageFile;

module.exports = {
  async generateVersion({ override, append }) {
    const { releaseType } = await promisify(conventionalRecommendedBump)({ preset: 'angular' });

    const numbers = version.match(/\d+/g).map(Number);
    let major = Number(numbers[0]);
    let minor = Number(numbers[1]);
    let patch = Number(numbers[2]);

    switch (releaseType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      throw new Error(`Invalid releaseType: ${releaseType}`);
    }

    let newVersion = override || `${major}.${minor}.${patch}`;

    if (append) {
      newVersion += append;
    }

    log.success(`Updating from ${version} to ${newVersion}`);

    return { newVersion };
  },

  async writeVersion({ newVersion, dryRun }) {
    if (dryRun) {
      log.dryRun(`Wrote ${newVersion} to package.json and package-lock.json`);
      return;
    }

    try {
      packageFile.version = newVersion;
      packageLockFile.version = newVersion;

      await fs.promises.writeFile(`${cwd}/package.json`, JSON.stringify(packageFile, null, 4));
      await fs.promises.writeFile(`${cwd}/package-lock.json`, JSON.stringify(packageLockFile, null, 4));

      log.success(`Wrote ${newVersion} to package.json and package-lock.json`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
