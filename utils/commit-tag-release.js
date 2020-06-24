const chalk = require('chalk');
const figures = require('figures');
const path = require('path');
const simpleGit = require('simple-git');
const fetch = require('node-fetch');
const branchName = require('current-git-branch');

const git = simpleGit(path.resolve(__dirname, '..'));
const branch = branchName(path.resolve(__dirname, '..'));
const { apiUrl } = require('../package.json').repository;

function success(message) {
  console.log(`${chalk.green(figures.tick)} ${message}`);
}

function error(message) {
  console.log(`${chalk.red(figures.cross)} ${message}`);
}

async function commitAndTag(version, changelog, token, push) {
  await git.add(['CHANGELOG.md', 'package.json'])
    .then(() => success('Staged changed files'))
    .catch((e) => error(`Could not stage files: ${e.message}`));

  await git.commit(`chore(release): ${version}`)
    .then(() => success('Commited files'))
    .catch((e) => error(`Could not commit files: ${e.message}`));

  await git.addTag(version)
    .then(() => success(`Tagged '${version}'`))
    .catch((e) => error(`Could not tag: ${e.message}`));

  if (push) {
    await git.push('origin', branch)
      .then(() => success('Pushed to origin'))
      .catch((e) => error(`Could not push to branch '${branch}': ${e.message}`));

    await git.pushTags('origin')
      .then(() => success('Pushed tags to origin'))
      .catch((e) => error(`Could not push tags': ${e.message}`));

    const releaseBody = {
      tag_name: version,
      name: version,
      body: changelog,
      draft: false,
      prerelease: false,
    };
    fetch(`${apiUrl}/releases`, {
      method: 'post',
      body: JSON.stringify(releaseBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          error(`Could not create Github release: ${res.status}`);
          throw new Error(`Could not create Github release: ${res.status}`);
        }
        success('Created Github release');
      });
  }
}

module.exports = commitAndTag;
