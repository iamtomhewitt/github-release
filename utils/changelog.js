const standardChangelog = require('standard-changelog');
const fs = require('fs');

const getChangelog = () => new Promise(((resolve, reject) => {
  const readable = standardChangelog();
  let result = '';

  readable.on('data', (chunk) => {
    result += chunk;
  });

  readable.on('end', () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const newDate = `${day}/${month}/${year}`;

    // Format date how I like it
    result = result.replace(`${year}-${month}-${day}`, newDate);

    fs.readFile(`${__dirname}/../CHANGELOG.md`, (readError, currentContents) => {
      const toWrite = result + (!currentContents ? '' : currentContents);

      fs.writeFile(`${__dirname}/../CHANGELOG.md`, toWrite, (err) => {
        if (err) {
          reject(err.message);
        }
        resolve('done');
      });
    });
  });
}));

module.exports = getChangelog;
