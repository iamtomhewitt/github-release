const fetch = require('node-fetch');
const chalk = require('chalk');
const figures = require('figures');
const { apiUrl } = require('../package.json').repository;
const { success } = require('./console-messages');

const getIssues = (labels) => new Promise(((resolve, reject) => {
  if (!apiUrl) {
    reject(new Error(`${chalk.red(figures.cross)} There is no "repository: { apiUrl : "<url>" }" in your package.json!`));
  }

  if (!labels) {
    reject(new Error(`${chalk.red(figures.cross)} No labels parameter specified for repo issues!`));
  }

  fetch(`${apiUrl}/issues`)
    .then((response) => response.json())
    .then((issues) => {
      const filteredIssues = issues.filter((i) => i.labels.every((l) => labels.includes(l.name)));
      success(`Adding ${issues.length} issues to the release`);
      resolve(filteredIssues);
    });
}));

module.exports = getIssues;
