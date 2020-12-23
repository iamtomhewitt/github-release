const fs = require('fs');

module.exports = {
  async createChangelog({ version, issues, dryRun }) {
    const cwd = process.cwd();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const date = `${day}/${month}/${year}`;

    if (dryRun) {
      return {
        success: true,
        message: 'CHANGELOG generated',
      };
    }
    try {
      const changelogLocation = `${cwd}/CHANGELOG.md`;
      const currentContents = await fs.promises.readFile(changelogLocation);
      
      let newContents = `## ${version} (${date}) \n\n\n`;
      newContents += issues.length > 0 ? '### Issues in this release:\n\n' : 'There are no issues in this release.';

      issues.forEach((issue) => {
        const { number, html_url, title } = issue;
        newContents += `* [#${number}](${html_url}) - ${title}\n`;
      });

      newContents += currentContents ? `\n\n\n${currentContents}` : '';

      await fs.promises.writeFile(changelogLocation, newContents);

      return {
        success: true,
        message: 'CHANGELOG generated',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  },
};
