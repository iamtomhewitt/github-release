const conventionalRecommendedBump = require('conventional-recommended-bump');
const fs = require('fs');
const glob = require('glob');
const { promisify } = require('util');

const cwd = process.cwd();

const log = require('../logger');

const { version } = require(`${cwd}/package.json`);

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
      log.dryRun(`Wrote ${newVersion} to the above files!`);
      return;
    }

    try {
      const filesToFind = '**/*(package.json|package-lock.json|pom.xml)';
      const files = await glob.sync(filesToFind, { ignore: 'node_modules/**' });

      log.info(`Found ${files.length} files to update: \n\t${files.join(', \n\t')}`);
      files.forEach(async (file) => {
        const isPackageFile = file.endsWith('.json');
        const isPomFile = file.endsWith('.xml');
        const fullFilePath = `${cwd}/${file}`;
        if (isPackageFile) {
          const actualFile = require(fullFilePath);
          actualFile.version = newVersion;
          await fs.promises.writeFile(fullFilePath, JSON.stringify(actualFile, null, 4));
        } else if (isPomFile) {
          const pomContents = await fs.promises.readFile(fullFilePath);
          const newPom = pomContents.toString().replace(`<version>${version}</version>`, `<version>${newVersion}</version>`);
          await fs.promises.writeFile(fullFilePath, newPom);
        }
      });

      log.success(`Wrote ${newVersion} to the above files!`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
