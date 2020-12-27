const simpleGit = require('simple-git');
const log = require('../logger');

module.exports = {
  async commitAndTag({ version, dryRun }) {
    if (dryRun) {
      log.success(`Staged and committed changed files, and tagged version '${version}'`);
      return;
    }

    try {
      const cwd = process.cwd();
      const git = simpleGit(cwd);

      await git.add([`${cwd}/CHANGELOG.md`, `${cwd}/package.json`, `${cwd}/package-lock.json`]);
      await git.commit(`chore(release): ${version}`);
      await git.addTag(version);

      log.success(`Staged and committed changed files, and tagged version '${version}'`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
