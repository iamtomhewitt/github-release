const { apiUrl } = require(`${process.cwd()}/package.json`).repository;
const { get, post, patch, remove } = require('../git/http');

module.exports = {
  async getIssues({ labels, token, dryRun }) {
    if (!apiUrl) {
      return {
        success: false,
        dryRun,
        message: 'There is no "repository: { apiUrl : "<url>" }" in your package.json!',
      };
    }

    if (dryRun) {
      return {
        success: true,
        dryRun,
        issues: [],
        message: 'Adding 0 issues to the release',
      };
    }

    const filteredIssues = [];

    const issues = await get({ url: `${apiUrl}/issues`, token });

    issues.forEach((issue) => {
      if (issue.labels.some((l) => labels.includes(l) >= 0)) {
        filteredIssues.push(issue);
      }
    });

    return {
      success: true,
      dryRun,
      issues: filteredIssues,
      message: `Adding ${filteredIssues.length} issues to the release`,
    };
  },

  async closeIssues({ issues, version, token }) {
    try {
      issues.forEach((issue) => {
        await post({ url: `${apiUrl}/issues/${issue.number}/comments`, body: JSON.stringify({ body: `Included in version ${version}` }), token })
        await patch({ url: `${apiUrl}/issues/${issue.number}`, body: JSON.stringify({ state: 'closed' }), token })
      })
    }
    catch (err) {
      return {
        success: false,
        dryRun,
        message: err.message
      };
    }
  },

  async removeLabels({ issues, token }) {
    try {
      issues.forEach((issue) => {
        await remove({ url: `${apiUrl}/issues/${issue.number}/labels`, token });
      })
    }
    catch (err) {
      return {
        success: false,
        dryRun,
        message: err.message
      };
    }
  }
};
