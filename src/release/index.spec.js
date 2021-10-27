const http = require('../git/http');
const { release } = require('.');

jest.mock('simple-git', () => () => ({
  add: () => 'add',
  addTag: () => 'add tag',
  commit: () => 'commit',
  push: () => 'push',
  pushTags: () => 'push tags',
}));

describe('release', () => {
  const version = '1.2.3';
  const changelog = 'changelog';
  const token = '12345';
  const issues = [];
  const prerelease = false;

  beforeEach(() => {
    jest.spyOn(http, 'post').mockResolvedValue({});
  });

  it('does not release in dry run mode', async () => {
    await release({ version, changelog, token, issues, dryRun: true, prerelease });
    expect(http.post).not.toHaveBeenCalled();
  });

  it('creates a release', async () => {
    await release({ version, changelog, token, issues, dryRun: false, prerelease });
    expect(http.post).toHaveBeenCalledTimes(1);
  });
});
