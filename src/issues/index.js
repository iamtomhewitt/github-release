const { apiUrl } = require(`${process.cwd()}/package.json`).repository;
const log = require('../logger');
const {
  get, post, patch, remove,
} = require('../git/http');

module.exports = {
  async getIssues({ labels, token, dryRun }) {
    if (!apiUrl) {
      log.error('There is no "repository: { apiUrl : "<url>" }" in your package.json!');
      return;
    }

    if (dryRun) {
      log.success('Adding 0 issues to the release');
      return;
    }

    try {
      const filteredIssues = [];
      const issues = await get({ url: `${apiUrl}/issues`, token });

      issues.forEach((issue) => {
        if (issue.labels.some((l) => labels.includes(l) >= 0)) {
          filteredIssues.push(issue);
        }
      });

      log.success(`Adding ${filteredIssues.length} issues to the release`);
      return { issues: filteredIssues };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async closeIssues({ issues, version, token }) {
    try {
      issues.forEach(async (issue) => {
        const { number } = issue;
        await post({ url: `${apiUrl}/issues/${number}/comments`, body: JSON.stringify({ body: `Included in version ${version}` }), token });
        await patch({ url: `${apiUrl}/issues/${number}`, body: JSON.stringify({ state: 'closed' }), token });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async removeLabels({ issues, token }) {
    try {
      issues.forEach(async (issue) => {
        const { number } = issue;
        await remove({ url: `${apiUrl}/issues/${number}/labels`, token });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
