const getVersion = require('./utils/version');

async function main() {
  const version = await getVersion('');
  console.log('Version', version);
}

main();
