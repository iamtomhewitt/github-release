#!/usr/bin/env node

const chalk = require('chalk');
const prompt = require('prompt');
const getVersion = require('./utils/version');
const { getIssues, closeIssues } = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitAndTag = require('./utils/commit-and-tag');
const release = require('./utils/release');
const { success, error } = require('./utils/console-messages');

async function main(input) {
  const {
    versionOverride, append, issueLabels, shouldCloseIssues, publish, token, dryRun,
  } = input;

  const version = await getVersion(versionOverride, append, dryRun);
  const issues = await getIssues(issueLabels);
  const changelog = await createChangelog(version, issues, dryRun);
  await commitAndTag(version, dryRun);

  if (publish) {
    if (dryRun) {
      success('Pushed to origin');
      success('Pushed tags to origin');
      success('Created Github release');
    } else {
      release(version, changelog, token);
    }
  }

  if (shouldCloseIssues && !dryRun) {
    closeIssues(issues, version, token);
  }
}

console.log(chalk.magenta('Github Releaser') + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));
const schema = {
  properties: {
    versionOverride: {
      type: 'string',
      description: 'Specify a version (hit enter to skip)',
    },
    append: {
      type: 'string',
      description: 'Append to version (hit enter to skip)',
    },
    issueLabels: {
      type: 'string',
      message: chalk.yellow('Issue labels are required!'),
      description: 'Issue labels (e.g. bug coded)',
    },
    shouldCloseIssues: {
      type: 'boolean',
      message: chalk.yellow('Must be one of \'true\', \'t\', \'false\', \'f\''),
      description: 'Close issues? (t/f)',
    },
    publish: {
      required: true,
      type: 'boolean',
      message: chalk.yellow('Must be one of \'true\', \'t\', \'false\', \'f\''),
      description: 'Push to Github? (t/f)',
    },
    token: {
      type: 'string',
      hidden: true,
      replace: '*',
      description: 'Github token (hit enter to skip)',
    },
    dryRun: {
      type: 'boolean',
      message: chalk.yellow('Must be one of \'true\', \'t\', \'false\', \'f\''),
      description: 'Dry run? (t/f)',
    },
  },
};
prompt.message = '';
prompt.delimeter = '';

prompt.start();

prompt.get(schema, (err, input) => {
  if (err) {
    error(`There was an error with prompt: ${err.message}`);
    process.exit(1);
  }

  const { publish, shouldCloseIssues, token } = input;

  if ((publish || shouldCloseIssues) && (!token || token.length === 0)) {
    error('No Github token has been specified');
    process.exit(1);
  }

  main(input);
});
