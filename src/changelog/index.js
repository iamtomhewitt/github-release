const fs = require('fs');
const log = require('../logger');

module.exports = {
  async createChangelog({ version, issues, dryRun }) {
    const cwd = process.cwd();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const date = `${day}/${month}/${year}`;

    if (dryRun) {
      log.success('CHANGELOG generated');
      return;
    }

    try {
      const changelogLocation = `${cwd}/CHANGELOG.md`;
      const currentContents = await fs.promises.readFile(changelogLocation);

      let newContents = `## ${version} (${date}) \n\n\n`;
      newContents += issues.length > 0 ? '### Issues in this release:\n\n' : 'There are no issues in this release.';

      issues.forEach((issue) => {
        const { number, html_url: url, title } = issue;
        newContents += `* [#${number}](${url}) - ${title}\n`;
      });

      newContents += currentContents ? `\n\n\n${currentContents}` : '';

      await fs.promises.writeFile(changelogLocation, newContents);

      log.success('CHANGELOG generated');
      return { changelog: newContents };
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
