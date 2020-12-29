const chalk = require('chalk');
const figures = require('figures');

const log = {
  success(message) {
    // eslint-disable-next-line
    console.log(`${chalk.green(figures.tick)} ${message}`);
  },
  error(message) {
    // eslint-disable-next-line
    console.log(`${chalk.red(figures.cross)} ${message}`);
  },
  warn(message) {
    // eslint-disable-next-line
    console.log(`${chalk.yellow(figures.warning)} ${message}`);
  },
  info(message) {
    // eslint-disable-next-line
    console.log(`${chalk.blue(figures.info)} ${message}`);
  },
  dryRun(message) {
    // eslint-disable-next-line
    console.log(`${chalk.magenta(figures.circleDouble)} DRY RUN: ${message}`);
  },
};

module.exports = log;
