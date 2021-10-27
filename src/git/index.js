const glob = require('glob');
const simpleGit = require('simple-git');
const log = require('../logger');

module.exports = {
  async commitAndTag({ version, dryRun }) {
    if (dryRun) {
      log.dryRun('Committed files');
      log.dryRun(`Tagged: ${version}`);
      return;
    }

    try {
      const cwd = process.cwd();
      const git = simpleGit(cwd);
      const filesToFind = '**/*(package.json|package-lock.json|pom.xml)';
      const files = await glob.sync(filesToFind, { ignore: 'node_modules/**' });

      files.forEach(async (file) => {
        const filePath = `${cwd}/${file}`;
        await git.add(filePath);
      });

      await git.add(`${cwd}/CHANGELOG.md`);
      await git.commit(`chore(release): ${version}`);
      await git.addTag(version);

      log.success('Committed the following files:');
      files.forEach((file) => {
        log.info(`\t${file}`);
      });
      log.success(`Tagged: ${version}`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
