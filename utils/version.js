const conventionalRecommendedBump = require('conventional-recommended-bump');
const fs = require('fs');
const async = require('async');
const { success, error } = require('./console-messages');

const cwd = process.cwd();
const { version } = require(`${cwd}/package.json`);
const packageFile = require(`${cwd}/package.json`);
const packageLockFile = require(`${cwd}/package-lock.json`);

module.exports = {
  generateVersion: (override, appendage) => new Promise(((resolve, reject) => {
    conventionalRecommendedBump({
      preset: 'angular',
    }, (err, recommendation) => {
      if (err) {
        reject(err);
      }

      const { releaseType } = recommendation;

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

      if (appendage) {
        newVersion += appendage;
      }

      success(`Updating version from ${version} to ${newVersion}`);
      resolve(newVersion);
    });
  })),

  writeVersion: (newVersion, dryRun) => new Promise(((resolve, reject) => {
    if (dryRun) {
      success(`Wrote ${newVersion} to package.json`);
      success(`Wrote ${newVersion} to package-lock.json`);
      resolve();
    } else {
      packageFile.version = newVersion;
      packageLockFile.version = newVersion;

      async.parallel([
        function (callback) {
          fs.writeFile(`${cwd}/package.json`, JSON.stringify(packageFile, null, 4), (err) => {
            if (err) {
              error(`Could not update package-lock.json: ${err.message}`);
              reject(new Error(`Could not update package-lock.json: ${err.message}`));
            }
          });
          success(`Wrote ${newVersion} to package.json`);

          callback();
        },
        function (callback) {
          fs.writeFile(`${cwd}/package-lock.json`, JSON.stringify(packageLockFile, null, 4), (err) => {
            if (err) {
              error(`Could not update package-lock.json: ${err.message}`);
              reject(new Error(`Could not update package-lock.json: ${err.message}`));
            }
          });
          success(`Wrote ${newVersion} to package-lock.json`);

          callback();
        }
      ], function (err, results) {
        if (err) {
          error(`Could not update package.json: ${err.message}`);
          reject(new Error(`Could not update package.json: ${err.message}`));
        }
        resolve();
      });
    }
  })),
};
