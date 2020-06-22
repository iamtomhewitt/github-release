const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');
const getChangelog = require('./utils/changelog');

async function main() {
  const version = await getVersion('');
  console.log('Version', version);


  const issues = await getIssues('bug');
  console.log(`Issues: ${issues.length}`);

  const changelog = await getChangelog(version, issues);
  console.log(changelog);
}

main();
