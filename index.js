#!/usr/bin/env node

const chalk = require('chalk');
const fetch = require('node-fetch');
const prompt = require('prompt');
const commitAndTag = require('./utils/commit-and-tag');
const createChangelog = require('./utils/changelog');
const release = require('./utils/release');
const { error } = require('./utils/console-messages');
const { generateVersion, writeVersion } = require('./utils/version');
const { getIssues, closeIssues, removeLabels } = require('./utils/issues');
const { version } = require('./package.json');

async function main(input) {
  const latestRelease = await fetch('https://api.github.com/repos/iamtomhewitt/github-releaser/releases/latest');
  const data = await latestRelease.json();

  if (version !== data.tag_name) {
    console.log(chalk.yellow(`Your version of github-releaser (${version}) is different to that from npm (${data.tag_name}) - please update when you can!`));
  }

  const {
    versionOverride, append, issueLabels, shouldCloseIssues, publish, token, dryRun,
  } = input;

  const newVersion = await generateVersion(versionOverride, append);
  await writeVersion(newVersion, dryRun);
  const issues = await getIssues(issueLabels, token);
  const changelog = await createChangelog(newVersion, issues, dryRun);
  await commitAndTag(newVersion, dryRun);

  if (publish) {
    release(newVersion, changelog, token, dryRun);
  }

  if (shouldCloseIssues && !dryRun) {
    closeIssues(issues, newVersion, token);
    removeLabels(issues, token);
  }
}

console.log(chalk.magenta(`Github Releaser (${version})`) + chalk.yellow(' by ') + chalk.cyan('Tom Hewitt'));
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
    token: {
      type: 'string',
      hidden: true,
      replace: '*',
      required: true,
      message: chalk.yellow('Token is required!'),
      description: 'Github token',
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

  main(input);
});
