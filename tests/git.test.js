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

  beforeEach(() => {
    spyOn(log, 'success')
    spyOn(log, 'dryRun')
  })

  it('does not perform git actions in dry run mode', async () => {
    await commitAndTag({ version, dryRun: true });

    expect(log.dryRun).toHaveBeenCalledTimes(2);
    expect(log.dryRun).toHaveBeenCalledWith('Committed files');
    expect(log.dryRun).toHaveBeenCalledWith('Tagged: 1.2.3');
  });

  it('runs git actions', async () => {
    await commitAndTag({ version, dryRun: false });

    expect(log.success).toHaveBeenCalledTimes(2);
    expect(log.success).toHaveBeenCalledWith('Committed the following files:');
    expect(log.success).toHaveBeenCalledWith('Tagged: 1.2.3');
  });
});
