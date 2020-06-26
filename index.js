#!/usr/bin/env node

const chalk = require('chalk');
const prompt = require('prompt');
const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const createChangelog = require('./utils/changelog');
const commitAndTag = require('./utils/commit-and-tag');
const release = require('./utils/release');
const { error } = require('./utils/console-messages');

async function main(input) {
  const {
    versionOverride, append, issues, publish, token, dryRun,
  } = input;

  const version = await getVersion(versionOverride, append, dryRun);
  const issuesToInclude = await getIssues(issues);
  const changelog = await createChangelog(version, issuesToInclude, dryRun);
  await commitAndTag(version, dryRun);

  if (publish) {
    release(version, changelog, token, dryRun);
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
      description: 'Append to tag (hit enter to skip)',
    },
    issues: {
      required: true,
      type: 'string',
      message: chalk.yellow('Issue labels are required!'),
      description: 'Issue labels separated by a comma (e.g. bug,coded)',
    },
    publish: {
      required: true,
      type: 'boolean',
      message: chalk.yellow('Must be one of \'true\', \'t\', \'false\', \'f\''),
      description: 'Push to Github?',
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
      description: 'Dry run?',
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

  const { publish, token } = input;

  if (publish && (!token || token.length === 0)) {
    error('Marked to publish to Github, but no token has been specified');
    process.exit(1);
  }

  main(input);
});
