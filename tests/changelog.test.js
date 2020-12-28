const fs = require('fs');
const sinon = require('sinon');
const { createChangelog } = require('../src/changelog');
const log = require('../src/logger');

describe('changelog', () => {
  const version = '1.2.3';
  const issues = [];

  const logSuccessSpy = jest.spyOn(log, 'success');
  const fsReadSpy = jest.spyOn(fs.promises, 'readFile');
  const fsWriteSpy = jest.spyOn(fs.promises, 'writeFile');

  afterEach(() => {
    sinon.restore();
  });

  it('does not create a changelog in dry run mode', async () => {
    const { changelog } = await createChangelog({ version, issues, dryRun: true });

    expect(changelog).toBe('');
    expect(logSuccessSpy).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fsReadSpy).not.toHaveBeenCalled();
    expect(fsWriteSpy).not.toHaveBeenCalled();
  });

  it('writes a changelog for no issues', async () => {
    sinon.stub(fs.promises, 'writeFile');

    const { changelog } = await createChangelog({ version, issues, dryRun: false });

    expect(changelog).not.toBeNull();
    expect(logSuccessSpy).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fsReadSpy).toHaveBeenCalled();
  });

  it('writes a changelog when there are issues included', async () => {
    sinon.stub(fs.promises, 'writeFile');
    const mockIssues = [
      {
        html_url: 'https://github.com/iamtomhewitt/github-releaser/issues/33',
        number: 33,
        title: 'Add tests',
      },
    ];

    const { changelog } = await createChangelog({ version, issues: mockIssues, dryRun: false });

    expect(changelog).not.toBeNull();
    expect(logSuccessSpy).toHaveBeenCalledWith('CHANGELOG generated');
    expect(fsReadSpy).toHaveBeenCalled();
  });
});
