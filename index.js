const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const getChangelog = require('./utils/changelog');

async function main() {
  const version = await getVersion('');
  console.log('Version', version);

  console.log();

  const issues = await getIssues('bug');
  console.log(`Issues: ${issues.length}`);

  const c = await getChangelog();
  console.log(c);
}

main();
