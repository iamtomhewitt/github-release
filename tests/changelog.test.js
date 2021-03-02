const fs = require('fs');
const log = require('../src/logger');
const { createChangelog } = require('../src/changelog');

describe('changelog', () => {
  const version = '1.2.3';
  const issues = [];

  beforeEach(() => {
    spyOn(log, 'success');
    spyOn(log, 'dryRun');
    spyOn(log, 'info');
    spyOn(fs.promises, 'writeFile');
    spyOn(fs.promises, 'readFile');

    fs.promises.writeFile = jest.fn();
  });

  it('does not create a changelog in dry run mode', async () => {
    const { changelog } = await createChangelog({ version, issues, dryRun: true });

    expect(changelog).toBe('');
    expect(log.dryRun).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fs.promises.readFile).not.toHaveBeenCalled();
    expect(fs.promises.writeFile).not.toHaveBeenCalled();
  });

  it('writes a changelog for no issues', async () => {
    const { changelog } = await createChangelog({ version, issues, dryRun: false });

    expect(changelog).toContain('There are no issues in this release');
    expect(changelog).toContain('1.2.3');
    expect(log.success).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fs.promises.readFile).toHaveBeenCalled();
  });

  it('writes a changelog when there are issues included', async () => {
    const mockIssues = [{
      html_url: 'https://github.com/iamtomhewitt/github-releaser/issues/33',
      number: 33,
      title: 'Add tests',
    }];

    const { changelog } = await createChangelog({ version, issues: mockIssues, dryRun: false });

    expect(changelog).toContain('33');
    expect(changelog).toContain('Add tests');
    expect(changelog).toContain('https://github.com/iamtomhewitt/github-releaser/issues/33');
    expect(log.success).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fs.promises.readFile).toHaveBeenCalled();
  });

  it('creates a changelog when there isnt one', async () => {
    fs.existsSync = jest.fn().mockResolvedValueOnce(false);

    await createChangelog({ version, issues: [], dryRun: false });

    expect(log.info).toHaveBeenCalledWith('CHANGELOG not found, creating one');
    expect(fs.promises.readFile).toHaveBeenCalled();
  });
});
