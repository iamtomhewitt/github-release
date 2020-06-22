const getVersion = require('./utils/version');
const getIssues = require('./utils/issues');

async function main() {
  const version = await getVersion('');
  console.log('Version', version);

  console.log();

  const issues = await getIssues('bug');
  console.log(`Issues: ${issues.length}`);
}

main();
