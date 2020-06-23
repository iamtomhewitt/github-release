const chalk = require('chalk');
const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitTagRelease = require('./utils/commit-tag-release');

async function main() {
  console.log(chalk.magenta('Github Releaser') + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));
  const version = await getVersion('');
  const issues = await getIssues('bug');
  const changelog = await createChangelog(version, issues);
  await commitTagRelease(version, changelog, '', true);
}

main();
