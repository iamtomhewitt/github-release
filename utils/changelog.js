const fs = require('fs');
const chalk = require('chalk');
const figures = require('figures');

const getChangelog = (version, issues) => new Promise(((resolve, reject) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const date = `${day}/${month}/${year}`;

  fs.readFile(`${__dirname}/../CHANGELOG.md`, (readError, currentContents) => {
    let toWrite = `## ${version} (${date}) \n\n\n### Issues in this release:\n\n`;

    issues.forEach((issue) => {
      toWrite += `* [#${issue.number}](${issue.html_url}) - ${issue.title}\n`;
    });

    toWrite += !currentContents ? '' : `\n\n\n${currentContents}`;

    fs.writeFile(`${__dirname}/../CHANGELOG.md`, toWrite, (err) => {
      if (err) {
        reject(new Error(`${chalk.red(figures.cross)} Could not generate CHANGELOG: ${err.message}`));
      }
      console.log(`${chalk.green(figures.tick)} CHANGELOG generated`);
      resolve(true);
    });
  });
}));

module.exports = getChangelog;
