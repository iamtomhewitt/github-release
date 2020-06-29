const branchName = require('current-git-branch');
const fetch = require('node-fetch');
const simpleGit = require('simple-git');
const { success, error } = require('./console-messages');

const cwd = process.cwd();
const branch = branchName(cwd);
const git = simpleGit(cwd);
const { apiUrl } = require(`${cwd}/package.json`).repository;

async function release(version, changelog, token) {
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

module.exports = release;
