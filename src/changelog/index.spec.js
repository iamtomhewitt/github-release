const fs = require('fs');

const { createChangelog } = require('.');

describe('changelog', () => {
  const version = '1.2.3';
  const issues = [];

  beforeEach(() => {
    jest.spyOn(fs.promises, 'writeFile');
    jest.spyOn(fs.promises, 'readFile');

    fs.promises.writeFile = jest.fn();
  });

  it('should create a changelog in dry run mode', async () => {
    const { changelog } = await createChangelog({ version, issues, dryRun: true });

    expect(changelog).toContain(version);
    expect(changelog).toContain('There are no issues in this release');
    expect(fs.promises.readFile).toHaveBeenCalled();
    expect(fs.promises.writeFile).not.toHaveBeenCalled();
  });

  it('should create a changelog for no issues', async () => {
    const { changelog } = await createChangelog({ version, issues, dryRun: false });

    expect(changelog).toContain('There are no issues in this release');
    expect(changelog).toContain('1.2.3');
    expect(fs.promises.readFile).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });

  it('should create a changelog when there are issues included', async () => {
    const mockIssues = [{
      html_url: 'a url',
      number: 33,
      title: 'Add tests',
    }];

    const { changelog } = await createChangelog({ version, issues: mockIssues, dryRun: false });

    expect(changelog).toContain('33');
    expect(changelog).toContain('Add tests');
    expect(changelog).toContain('a url');
    expect(fs.promises.readFile).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });

  it('should create a changelog when there isnt one', async () => {
    fs.existsSync = jest.fn().mockResolvedValueOnce(false);

    const { changelog } = await createChangelog({ version, issues: [], dryRun: false });

    expect(changelog).toContain('There are no issues in this release');
    expect(changelog).toContain('1.2.3');
    expect(fs.promises.readFile).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });
});
