#!/usr/bin/env node

const chalk = require('chalk');
const fetch = require('node-fetch');
const prompt = require('prompt');

const log = require('./src/logger');
const { commitAndTag } = require('./src/git');
const { createChangelog } = require('./src/changelog');
const { generateVersion, writeVersion } = require('./src/version');
const { getIssues, closeIssues, removeLabels } = require('./src/issues');
const { release } = require('./src/release');
const { version } = require('./package.json');

async function main(input) {
  const { append, dryRun, labels, override, prerelease, publish, shouldCloseIssues, token } = input;

  if (dryRun) {
    log.info('=== Running in dry run mode ===');
  }

  const latestRelease = await fetch('https://api.github.com/repos/iamtomhewitt/github-releaser/releases/latest');
  const data = await latestRelease.json();

  if (version !== data.tag_name) {
    log.warn(`Your version of github-releaser (${version}) is different to that from npm (${data.tag_name}) - please update when you can!`);
  }

  try {
    const { newVersion } = await generateVersion({ currentVersion: version, override, append });
    await writeVersion({ currentVersion: version, newVersion, dryRun });

    const { issues } = await getIssues({ labels, token, dryRun });

    const { changelog } = await createChangelog({ version: newVersion, issues, dryRun });

    await commitAndTag({ version: newVersion, dryRun });

    if (publish) {
      await release({ version: newVersion, changelog, token, dryRun, prerelease });
    }

    if (shouldCloseIssues && !dryRun) {
      await closeIssues({ issues, version: newVersion, token });
      await removeLabels({ issues, token });
    }
  } catch (err) {
    log.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

log.info(`Github Releaser (${version}) by Tom Hewitt`);
const schema = {
  properties: {
    override: {
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
    labels: {
      type: 'string',
      message: chalk.yellow('Issue labels are required!'),
      description: 'Issue labels (e.g. bug,coded,someLabel)',
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
    prerelease: {
      type: 'boolean',
      message: chalk.yellow('Must be one of \'true\', \'t\', \'false\', \'f\''),
      description: 'Prerelease? (t/f)',
      ask() {
        return prompt.history('publish').value > 0;
      },
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
    log.error(`There was an error with prompt: ${err.message}`);
    process.exit(1);
  }

  main(input);
});
