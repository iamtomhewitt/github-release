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

  const httpSpy = jest.spyOn(http, 'post').mockResolvedValue({});

  beforeEach(() => {
    spyOn(log, 'success');
    spyOn(log, 'dryRun');
  });

  it('does not release in dry run mode', async () => {
    await release({
      version, changelog, token, issues, dryRun: true, prerelease,
    });

    expect(log.dryRun).toHaveBeenCalledWith('Pushed to origin with tags, and created Github release');
    expect(log.success).not.toHaveBeenCalled();
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('creates a release', async () => {
    await release({
      version, changelog, token, issues, dryRun: false, prerelease,
    });

    expect(log.success).toHaveBeenCalledWith('Pushed to origin with tags, and created Github release');
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });
});
