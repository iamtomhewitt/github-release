const simpleGit = require('simple-git');
const { success, error } = require('./console-messages');

const git = simpleGit(process.cwd());

async function commitAndTag(version, dryRun) {
  if (dryRun) {
    success('Staged changed files');
    success('Commited files');
    success(`Tagged '${version}'`);
  } else {
    const cwd = process.cwd();
    await git.add([`${cwd}/CHANGELOG.md`, `${cwd}/package.json`, `${cwd}/package-lock.json`])
      .then(() => success('Staged changed files'))
      .catch((e) => error(`Could not stage files: ${e.message}`));

    await git.commit(`chore(release): ${version}`)
      .then(() => success('Commited files'))
      .catch((e) => error(`Could not commit files: ${e.message}`));

    await git.addTag(version)
      .then(() => success(`Tagged '${version}'`))
      .catch((e) => error(`Could not tag: ${e.message}`));
  }
}

module.exports = commitAndTag;
