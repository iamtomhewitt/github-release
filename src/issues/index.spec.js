const { getIssues, closeIssues, removeLabels } = require('.');
const log = require('../logger');

jest.mock('node-fetch', () => jest.fn(() => ({
  then: jest.fn().mockImplementationOnce(() => Promise.resolve([{ number: '1', title: 'test' }])),
})));

describe('issues', () => {
  const labels = 'bug,coded';
  const token = '12345';
  const version = '1.2.3';

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(log, 'success');
    jest.spyOn(log, 'dryRun');
    jest.spyOn(log, 'error');
  });

  describe('get issues', () => {
    it('returns 0 issues in dry run mode', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: true });

      expect(issues).toHaveLength(0);
      expect(log.dryRun).toHaveBeenCalledWith('Adding 0 issues to the release');
    });

    // TODO find a way to mock package.json contents for a test
    xit('returns 0 issues when there is no api url', async () => {
      jest.mock('../src/issues', () => ({ getApiUrl: jest.fn() }));
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(0);
      expect(log.error).toHaveBeenCalledWith('There is no "repository: { apiUrl : "<url>" }" in your package.json!');
    });

    it('returns issues', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(1);
      expect(log.success).toHaveBeenCalledWith('Adding 1 issues to the release');
    });
  });

  describe('close issues', () => {
    it('makes the correct number of calls', async () => {
      const issues = [{ number: '1' }, { number: '2' }];

      await closeIssues({ issues, version, token });

      expect(log.success).toHaveBeenCalledWith('Issues closed');
    });
  });

  describe('remove issues', () => {
    it('makes the correct number of calls', async () => {
      const issues = [{ number: '1' }, { number: '2' }];

      await removeLabels({ issues, token });

      expect(log.success).toHaveBeenCalledWith('Issue labels removed');
    });
  });
});
