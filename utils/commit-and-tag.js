const chalk = require('chalk');
const figures = require('figures');
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit(path.resolve(__dirname, '..'));

function success(message) {
  console.log(`${chalk.green(figures.tick)} ${message}`);
}

function error(message) {
  console.log(`${chalk.red(figures.cross)} ${message}`);
}

async function commitAndTag(version) {
  await git.add(['CHANGELOG.md', 'package.json'])
    .then(() => success('Staged changed files'))
    .catch((e) => error(`Could not stage files: ${e.message}`));

  await git.commit(`chore(release): ${version}`)
    .then(() => success('Commited files'))
    .catch((e) => error(`Could not commit files: ${e.message}`));

  await git.addTag(version)
    .then(() => success(`Tagged '${version}'`))
    .catch((e) => error(`Could not tag: ${e.message}`));
}

module.exports = commitAndTag;
