const conventionalRecommendedBump = require('conventional-recommended-bump');
const cwd = process.cwd();
const fs = require('fs');
const packageFile = require(`${cwd}/package.json`);
const packageLockFile = require(`${cwd}/package-lock.json`);
const { promisify } = require('util');
const { version } = package;

module.exports = {
  async generateVersion({ override, appendage }) {
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
        return {
          success: false,
          message: `Invalid releaseType: ${releaseType}`,
        };
    }

    let newVersion = override || `${major}.${minor}.${patch}`;

    if (appendage) {
      newVersion += appendage;
    }

    return {
      success: true,
      message: `Updating version from ${version} to ${newVersion}`,
      newVersion,
    };
  },

  async writeVersion({ newVersion, dryRun }) {
    if (dryRun) {
      // TODO this should be a separate method in a utils file or something
      return {
        success: true,
        message: `Wrote ${newVersion} to package.json and package-lock.json`,
      };
    }

    try {
      package.version = newVersion
      packageLock.version = newVersion;

      await fs.promises.writeFile(`${cwd}/package.json`, JSON.stringify(packageFile, null, 4));
      await fs.promises.writeFile(`${cwd}/package-lock.json`, JSON.stringify(packageLockFile, null, 4));

      return {
        success: true,
        message: `Wrote ${newVersion} to package.json and package-lock.json`,
      };
    }
    catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  },
};
