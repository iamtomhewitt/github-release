const chalk = require('chalk');
const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitTagRelease = require('./utils/commit-tag-release');

async function main(flags) {
  console.log(chalk.magenta('Github Releaser') + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));

  const {
    versionAppend, issues, publish, token, dryRun,
  } = flags;

  const version = await getVersion(versionAppend);
  const issuesToInclude = await getIssues(issues);
  const changelog = await createChangelog(version, issuesToInclude);
  await commitTagRelease(version, changelog, token, publish);
}

module.exports = main;
