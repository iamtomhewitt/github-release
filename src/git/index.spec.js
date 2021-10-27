const simpleGit = require('simple-git');

const log = require('../logger');
const { commitAndTag } = require('.');

jest.mock('simple-git', () => () => ({
  add: () => 'added',
  addTag: () => 'added tag',
  commit: () => 'commited',
}));

describe('git', () => {
  const git = simpleGit(process.cwd());
  const version = '1.2.3';

  beforeEach(() => {
    jest.spyOn(git, 'add');
    jest.spyOn(git, 'addTag');
    jest.spyOn(git, 'commit');
  });

  it('should not perform git actions in dry run mode', async () => {
    await commitAndTag({ version, dryRun: true });

    expect(git.add).not.toHaveBeenCalled();
    expect(git.addTag).not.toHaveBeenCalled();
    expect(git.commit).not.toHaveBeenCalled();
  });

  it('should run git actions', async () => {
    jest.spyOn(log, 'success');

    await commitAndTag({ version, dryRun: false });

    expect(log.success).toHaveBeenCalledWith('Tagged: 1.2.3');
  });
});
