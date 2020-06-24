const chalk = require('chalk');
const figures = require('figures');

module.exports = {
  success(message) {
    console.log(`${chalk.green(figures.tick)} ${message}`);
  },
  error(message) {
    console.log(`${chalk.red(figures.cross)} ${message}`);
  },
};
