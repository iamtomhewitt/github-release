const chalk = require('chalk');
const fetch = require('node-fetch');
const figures = require('figures');

const { apiUrl } = require(`${process.cwd()}/package.json`).repository;
const { success, error } = require('./console-messages');

module.exports = {
  getIssues: (labels, token) => new Promise((resolve, reject) => {
    if (!apiUrl) {
      reject(new Error(`${chalk.red(figures.cross)} There is no "repository: { apiUrl : "<url>" }" in your package.json!`));
    }

    const filteredIssues = [];
    fetch(`${apiUrl}/issues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((issues) => {
        issues.forEach((issue) => {
          issue.labels.forEach((label) => {
            if (labels.includes(label.name)) {
              filteredIssues.push(issue);
            }
          });
        });
        success(`Adding ${filteredIssues.length} issues to the release`);
        resolve(filteredIssues);
      });
  }),

  closeIssues: (issues, version, token) => {
    issues.forEach((issue) => {
      // Add a comment
      fetch(`${apiUrl}/issues/${issue.number}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: `Included in version ${version}` }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            error(`Could not add comment to issue #${issue.number}: ${res.status}`);
            throw new Error(`Could not add comment to issue #${issue.number}: ${res.status}`);
          }
        });

      // Update status
      fetch(`${apiUrl}/issues/${issue.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: 'closed' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            error(`Could not close issue #${issue.number}: ${res.status}`);
            throw new Error(`Could not close issue #${issue.number}: ${res.status}`);
          }
        });
    });
  },

  removeLabels: (issues, token) => {
    issues.forEach((issue) => {
      fetch(`${apiUrl}/issues/${issue.number}/labels`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            error(`Could not remove labels from issue #${issue.number}: ${res.status}`);
            throw new Error(`Could not remove label from issue #${issue.number}: ${res.status}`);
          }
        });
    });
  },
};
