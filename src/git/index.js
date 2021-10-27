const glob = require('glob');
const simpleGit = require('simple-git');

const log = require('../logger');

module.exports = {
  async commitAndTag({ version, dryRun }) {
    try {
      const cwd = process.cwd();
      const git = simpleGit(cwd);
      const filesToFind = '**/*(package.json|package-lock.json|pom.xml)';
      const files = await glob.sync(filesToFind, { ignore: 'node_modules/**' });

      files.forEach(async (file) => {
        const filePath = `${cwd}/${file}`;
        if (!dryRun) {
          await git.add(filePath);
        }
      });

      if (!dryRun) {
        await git.add(`${cwd}/CHANGELOG.md`);
        await git.commit(`chore(release): ${version}`);
        await git.addTag(version);
      }

      log.success(`Committed ${files.length} files: \n\t${files.join(', \n\t')}`);
      log.success(`Tagged: ${version}`);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
