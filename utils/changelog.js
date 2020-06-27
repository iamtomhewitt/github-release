const fs = require('fs');
const { success, error } = require('./console-messages');

const createChangelog = (version, issues, dryRun) => new Promise((resolve, reject) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}/${month}/${year}`;

  const cwd = process.cwd();

  if (dryRun) {
    success('CHANGELOG generated');
    resolve('Dry Run');
  } else {
    fs.readFile(`${cwd}/CHANGELOG.md`, (readError, currentContents) => {
      let toWrite = `## ${version} (${date}) \n\n\n`;
      toWrite += issues.length > 0 ? '### Issues in this release:\n\n' : 'There are no issues in this release.';

      issues.forEach((issue) => {
        toWrite += `* [#${issue.number}](${issue.html_url}) - ${issue.title}\n`;
      });

      const newContents = toWrite;

      toWrite += !currentContents ? '' : `\n\n\n${currentContents}`;

      fs.writeFile(`${cwd}/CHANGELOG.md`, toWrite, (err) => {
        if (err) {
          error(`Could not generate CHANGELOG: ${err.message}`);
          reject(new Error(`Could not generate CHANGELOG: ${err.message}`));
        }
        success('CHANGELOG generated');
        resolve(newContents);
      });
    });
  }
});

module.exports = createChangelog;
