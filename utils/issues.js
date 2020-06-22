const fetch = require('node-fetch');
const chalk = require('chalk');
const figures = require('figures');
const issuesUrl = require('../package.json').bugs.url;

const getIssues = (labels) => new Promise(((resolve, reject) => {
  if (!issuesUrl) {
    reject(new Error(`${chalk.red(figures.cross)} There is no "bugs: { url : "<url>" }" in your package.json!`));
  }

  if (!labels) {
    reject(new Error(`${chalk.red(figures.cross)} No labels parameter specified for repo issues!`));
  }

  const apiUrl = issuesUrl.replace('github.com', 'api.github.com/repos');

  fetch(apiUrl)
    .then((response) => response.json())
    .then((issues) => {
      const filteredIssues = issues.filter((i) => i.labels.every((l) => labels.includes(l.name)));
      console.log(`${chalk.green(figures.tick)} ${issues.length} issues found to add to release`);
      resolve(filteredIssues);
    });
}));

module.exports = getIssues;
