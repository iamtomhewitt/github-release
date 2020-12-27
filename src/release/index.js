const branchName = require('current-git-branch');
const simpleGit = require('simple-git');
const { post } = require('../git/http');

const cwd = process.cwd();
const branch = branchName(cwd);
const git = simpleGit(cwd);
const log = require('../logger');

const { apiUrl } = require(`${cwd}/package.json`).repository;

module.exports = {
  async release({
    version, changelog, token, dryRun, prerelease,
  }) {
    if (dryRun) {
      log.success('Pushed to origin with tags, and created Github release');
      return;
    }

    try {
      await git.push('origin', branch);
      await git.pushTags('origin');

      const body = {
        tag_name: version,
        name: version,
        body: changelog,
        draft: false,
        prerelease,
      };

      await post({ url: `${apiUrl}/releases`, body, token });

      log.success('Pushed to origin with tags, and created Github release');
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
