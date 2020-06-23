const chalk = require('chalk');
const figures = require('figures');
const path = require("path");
const simpleGit = require('simple-git');
const branchName = require('current-git-branch');
const git = simpleGit(path.resolve(__dirname, '..'));
const branch = branchName(path.resolve(__dirname, '..'))

const { repository: { url } } = require('../package.json');

async function commitAndTag(version, push) {

	await git.add(['CHANGELOG.md', 'package.json']).catch(e => addError(e));
	await git.commit('chore(release): ' + version).catch(e => commitError(e))
	await git.addTag(version).catch(e => tagError(e));
	
	if (push) {
		await git.push('origin', branch).catch(e => console.log(e.message))
	}
}

function tagError(e) {
	console.log(`${chalk.red(figures.cross)} Could not add new tag: ${e.message}`)
}

function addError(e) {
	console.log(`${chalk.red(figures.cross)} Could not add files: ${e.message}`)
}

function commitError(e) {
	console.log(`${chalk.red(figures.cross)} Could not commit files: ${e.message}`)
}

module.exports = commitAndTag;
