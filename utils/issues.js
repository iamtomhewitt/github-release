const fetch = require('node-fetch');
const chalk = require('chalk');
const figures = require('figures');

const { apiUrl } = require(`${process.cwd()}/package.json`).repository;
const { success } = require('./console-messages');

const getIssues = (labels) => new Promise(((resolve, reject) => {
  if (!apiUrl) {
    reject(new Error(`${chalk.red(figures.cross)} There is no "repository: { apiUrl : "<url>" }" in your package.json!`));
  }

  fetch(`${apiUrl}/issues`)
    .then((response) => response.json())
    .then((issues) => {
      const filteredIssues = [];
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
}));

module.exports = getIssues;
