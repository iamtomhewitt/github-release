const simpleGit = require('simple-git');

module.exports = {
  async commitAndTag({ version, dryRun }) {
    if (dryRun) {
      return {
        success: true,
        dryRun,
        message: `Staged and committed changed files, and tagged version '${version}'`,
      };
    }

    try {
      const cwd = process.cwd();
      const git = simpleGit(cwd);
      
      await git.add([`${cwd}/CHANGELOG.md`, `${cwd}/package.json`, `${cwd}/package-lock.json`]);
      await git.commit(`chore(release): ${version}`);
      await git.addTag(version);
      
      return {
        success: true,
        dryRun,
        message: `Staged and committed changed files, and tagged version '${version}'`,
      };
    } catch (err) {
      return {
        success: false,
        dryRun,
        message: err.message,
      };
    }
  },
};
