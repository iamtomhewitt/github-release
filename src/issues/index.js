const { apiUrl } = require(`${process.cwd()}/package.json`).repository;
const log = require('../logger');
const http = require('../git/http');

module.exports = {
  async getIssues({ labels, token, dryRun }) {
    if (!apiUrl) {
      log.error('There is no "repository: { apiUrl : "<url>" }" in your package.json!');
      return { issues: [] };
    }

    if (dryRun) {
      log.dryRun('Adding 0 issues to the release');
      return { issues: [] };
    }

    try {
      const issues = await http.get({ url: `${apiUrl}/issues?labels=${labels}`, token });
      log.success(`Adding ${issues.length} issues to the release`);
      return { issues };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async closeIssues({ issues, version, token }) {
    try {
      issues.forEach(async (issue) => {
        const { number } = issue;
        await http.post({ url: `${apiUrl}/issues/${number}/comments`, body: JSON.stringify({ body: `Included in version ${version}` }), token });
        await http.patch({ url: `${apiUrl}/issues/${number}`, body: JSON.stringify({ state: 'closed' }), token });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async removeLabels({ issues, token }) {
    try {
      issues.forEach(async (issue) => {
        const { number } = issue;
        await http.remove({ url: `${apiUrl}/issues/${number}/labels`, token });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
