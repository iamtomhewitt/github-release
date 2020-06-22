const conventionalRecommendedBump = require('conventional-recommended-bump');
const { version } = require('../package.json');

module.exports = function getVersion(appendage, callback) {
  conventionalRecommendedBump({
    preset: 'angular',
  }, (error, recommendation) => {
    const { releaseType } = recommendation;

    let major = Number(version[0]);
    let minor = Number(version[2]);
    let patch = Number(version[4]);

    switch (releaseType) {
    case 'major':
      major += 1;
      break;
    case 'minor':
      minor += 1;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      throw new Error(`Invalid releaseType: ${releaseType}`);
    }

    let newVersion = `${major}.${minor}.${patch}`;

    if (appendage) {
      newVersion += appendage;
    }

    callback(newVersion);
  });
};
