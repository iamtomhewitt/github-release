const chalk = require('chalk');
const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitAndTag = require('./utils/commit-and-tag');
const release = require('./utils/release');

async function main(flags) {
  console.log(chalk.magenta('Github Releaser') + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));

  const {
    versionAppend, issues, publish, token, dryRun,
  } = flags;

  const version = await getVersion(versionAppend);
  const issuesToInclude = await getIssues(issues);
  const changelog = await createChangelog(version, issuesToInclude);
  await commitAndTag(version);

  if (publish) {
    release(version, changelog, token);
  }
}

module.exports = main;
