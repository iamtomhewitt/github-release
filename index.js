const chalk = require('chalk');
const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitAndTag = require('./utils/commit-and-tag');

async function main() {
  console.log(chalk.magenta('Github Releaser') + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));
  const version = await getVersion('');
  const issues = await getIssues('bug');
  await createChangelog(version, issues);
  await commitAndTag(version, false);
}

main();
