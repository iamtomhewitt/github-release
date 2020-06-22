const fetch = require('node-fetch');
const issuesUrl = require('../package.json').bugs.url;

const getIssues = (labels) => new Promise(((resolve, reject) => {
  if (!issuesUrl) {
    reject(new Error('There is no "bugs: { url : "<url>" }" in your package.json!'));
  }

  if (!labels) {
    reject(new Error('No labels parameter specified for repo issues!'));
  }

  const apiUrl = issuesUrl.replace('github.com', 'api.github.com/repos');

  fetch(apiUrl)
    .then((response) => response.json())
    .then((issues) => {
      const filteredIssues = issues.filter((i) => i.labels.every((l) => labels.includes(l.name)));
      resolve(filteredIssues);
    });
}));

module.exports = getIssues;
