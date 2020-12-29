const { getIssues, closeIssues, removeLabels } = require('../src/issues');
const log = require('../src/logger');

jest.mock('node-fetch', () => {
  const context = {
    then: jest.fn().mockImplementationOnce(() => Promise.resolve([{ number: '1', title: 'test' }])),
  };
  return jest.fn(() => context);
});

describe('issues', () => {
  const logSuccessSpy = jest.spyOn(log, 'success');
  const logDryRunSpy = jest.spyOn(log, 'dryRun');
  const logErrorSpy = jest.spyOn(log, 'error');

  const labels = 'bug,coded';
  const token = '12345';
  const version = '1.2.3';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get issues', () => {
    it('returns 0 issues in dry run mode', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: true });

      expect(issues).toHaveLength(0);
      expect(logDryRunSpy).toHaveBeenCalledWith('Adding 0 issues to the release');
    });

    // TODO find a way to mock package.json contents for a test
    xit('returns 0 issues when there is no api url', async () => {
      jest.mock('../src/issues', () => ({ getApiUrl: jest.fn() }));
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(0);
      expect(logErrorSpy).toHaveBeenCalledWith('There is no "repository: { apiUrl : "<url>" }" in your package.json!');
    });

    it('returns issues', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(1);
      expect(logSuccessSpy).toHaveBeenCalledWith('Adding 1 issues to the release');
    });
  });

  describe('close issues', () => {
    it('makes the correct number of calls', async () => {
      const issues = [{ number: '1' }, { number: '2' }];

      await closeIssues({ issues, version, token });

      expect(logSuccessSpy).toHaveBeenCalledWith('Issues closed');
    });
  });

  describe('remove issues', () => {
    it('makes the correct number of calls', async () => {
      const issues = [{ number: '1' }, { number: '2' }];

      await removeLabels({ issues, token });

      expect(logSuccessSpy).toHaveBeenCalledWith('Issue labels removed');
    });
  });
});
