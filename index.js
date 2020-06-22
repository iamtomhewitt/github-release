const getVersion = require('./utils/version');

getVersion('', (result) => {
  console.log(`Version returned: ${result}`);
});
