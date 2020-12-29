const http = require('../src/git/http');
const log = require('../src/logger');
const { release } = require('../src/release');

jest.mock('simple-git', () => {
  const mGit = {
    add: jest.fn(),
    addTag: jest.fn(),
    commit: jest.fn(),
    push: jest.fn(),
    pushTags: jest.fn(),
  };
  return jest.fn(() => mGit);
});

describe('release', () => {
  const version = '1.2.3';
  const changelog = '';
  const token = '12345';
  const issues = [];
  const prerelease = false;

  const logSuccessSpy = jest.spyOn(log, 'success');
  const logDryRunSpy = jest.spyOn(log, 'dryRun');
  const httpPostSpy = jest.spyOn(http, 'post').mockResolvedValue({});

  it('does not release in dry run mode', async () => {
    await release({
      version, changelog, token, issues, dryRun: true, prerelease,
    });

    expect(logDryRunSpy).toHaveBeenCalledWith('Pushed to origin with tags, and created Github release');
    expect(logSuccessSpy).not.toHaveBeenCalled();
    expect(httpPostSpy).not.toHaveBeenCalled();
  });

  it('creates a release', async () => {
    await release({
      version, changelog, token, issues, dryRun: false, prerelease,
    });

    expect(logSuccessSpy).toHaveBeenCalledWith('Pushed to origin with tags, and created Github release');
    expect(httpPostSpy).toHaveBeenCalledTimes(1);
  });
});
