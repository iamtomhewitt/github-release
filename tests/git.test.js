const { commitAndTag } = require('../src/git');
const log = require('../src/logger');

jest.mock('simple-git', () => {
  const mGit = {
    add: jest.fn(),
    addTag: jest.fn(),
    commit: jest.fn(),
  };
  return jest.fn(() => mGit);
});

describe('git', () => {
  const version = '1.2.3';
  const logSuccessSpy = jest.spyOn(log, 'success');
  const logDryRunSpy = jest.spyOn(log, 'dryRun');

  it('does not perform git actions in dry run mode', async () => {
    await commitAndTag({ version, dryRun: true });

    expect(logDryRunSpy).toHaveBeenCalledTimes(2);
    expect(logDryRunSpy).toHaveBeenCalledWith('Committed files');
    expect(logDryRunSpy).toHaveBeenCalledWith('Tagged: 1.2.3');
  });

  it('runs git actions', async () => {
    await commitAndTag({ version, dryRun: false });

    expect(logSuccessSpy).toHaveBeenCalledTimes(2);
    expect(logSuccessSpy).toHaveBeenCalledWith('Committed the following files:');
    expect(logSuccessSpy).toHaveBeenCalledWith('Tagged: 1.2.3');
  });
});
