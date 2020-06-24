#!/usr/bin/env node

const meow = require('meow');
const main = require('.');

const cli = meow(`
    Usage
      $ node github-release.js <options>
 
    Options
      --version-append, -a  Append a string to your version
      --issues, -i  Comma separated list of issue labels to include in release
      --publish, -p  Publish to remote & create Github release
      --token, -t  Github auth token
      --dry-run, -dr  Do everything but don't actually do it
`, {
  flags: {
    'version-append': {
      type: 'string',
      alias: 'a',
    },
    issues: {
      type: 'string',
      alias: 'i',
    },
    publish: {
      type: 'boolean',
      alias: 'p',
    },
    token: {
      type: 'string',
      alias: 't',
    },
    'dry-run': {
      type: 'boolean',
      alias: 'dr',
    },
  },
});

main(cli.flags);
