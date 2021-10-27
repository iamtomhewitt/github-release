const { commitAndTag } = require('.');
const log = require('../logger');

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

  beforeEach(() => {
    jest.spyOn(log, 'success');
    jest.spyOn(log, 'dryRun');
  });

  it('does not perform git actions in dry run mode', async () => {
    await commitAndTag({ version, dryRun: true });

    expect(log.dryRun).toHaveBeenCalledTimes(2);
    expect(log.dryRun).toHaveBeenCalledWith('Committed files');
    expect(log.dryRun).toHaveBeenCalledWith('Tagged: 1.2.3');
  });

  it('runs git actions', async () => {
    await commitAndTag({ version, dryRun: false });

    expect(log.success).toHaveBeenCalledTimes(2);
    expect(log.success).toHaveBeenCalledWith('Tagged: 1.2.3');
  });
});
