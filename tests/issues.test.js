const http = require('../src/git/http');
const { getIssues, closeIssues, removeLabels } = require('../src/issues');
const log = require('../src/logger');

describe('issues', () => {
  const logSuccessSpy = jest.spyOn(log, 'success');
  const logDryRunSpy = jest.spyOn(log, 'dryRun');
  const logErrorSpy = jest.spyOn(log, 'error');
  const httpGetSpy = jest.spyOn(http, 'get').mockResolvedValue([{ number: '1', title: 'test' }]);

  const labels = 'bug,coded';
  const token = '12345';
  const version = '1.2.3';

  describe('get issues', () => {
    it('returns 0 issues in dry run mode', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: true });

      expect(issues).toHaveLength(0);
      expect(logDryRunSpy).toHaveBeenCalledWith('Adding 0 issues to the release');
      expect(httpGetSpy).not.toHaveBeenCalled();
    });

    // TODO find a way to mock package.json contents for a test
    xit('returns 0 issues when there is no api url', async () => {
      jest.mock('../src/issues', () => ({ getApiUrl: jest.fn() }));
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(0);
      expect(logErrorSpy).toHaveBeenCalledWith('There is no "repository: { apiUrl : "<url>" }" in your package.json!');
      expect(httpGetSpy).not.toHaveBeenCalled();
    });

    it('returns issues', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: false });

      expect(issues).toHaveLength(1);
      expect(logSuccessSpy).toHaveBeenCalledWith('Adding 1 issues to the release');
      expect(httpGetSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('close issues', () => {
    it('makes the correct number of calls', async () => {
      const httpPostSpy = jest.spyOn(http, 'post').mockResolvedValue({});
      const httpPatchSpy = jest.spyOn(http, 'patch').mockResolvedValue({});
      const issues = [{ number: '1' }, { number: '2' }];

      await closeIssues({ issues, version, token });

      expect(httpPostSpy).toHaveBeenCalledTimes(2);
      expect(httpPatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove issues', () => {
    it('makes the correct number of calls', async () => {
      const httpRemoveSpy = jest.spyOn(http, 'remove').mockResolvedValue({});
      const issues = [{ number: '1' }, { number: '2' }];

      await removeLabels({ issues, token });

      expect(httpRemoveSpy).toHaveBeenCalledTimes(2);
    });
  });
});
