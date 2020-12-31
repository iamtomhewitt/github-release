const simpleGit = require('simple-git');
const fs = require('fs');
const log = require('../logger');

module.exports = {
  async commitAndTag({ version, dryRun }) {
    if (dryRun) {
      log.dryRun(`Staged and committed changed files, and tagged version '${version}'`);
      return;
    }

    try {
      const cwd = process.cwd();
      const git = simpleGit(cwd);
      const pomLocation = `${cwd}/pom.xml`;
      const files = [`${cwd}/CHANGELOG.md`, `${cwd}/package.json`, `${cwd}/package-lock.json`];

      if (fs.existsSync(pomLocation)) {
        files.push(`${cwd}/pom.xml`);
      }

      await git.add(files);
      await git.commit(`chore(release): ${version}`);
      await git.addTag(version);

      log.success(`Staged and committed changed files, and tagged version '${version}'`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
