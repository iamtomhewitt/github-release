const { getIssues, closeIssues, removeLabels } = require('.');
const http = require('../git/http');
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
    jest.resetModules();

    jest.spyOn(log, 'success');
    jest.spyOn(log, 'error');
  });

  describe('getting issues', () => {
    it('should return issues in dry run mode', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: true });
      expect(issues).toHaveLength(1);
    });

    it('should return no issues when no labels supplied', async () => {
      const { issues } = await getIssues({ labels: '', token, dryRun: false });
      expect(issues).toHaveLength(0);
    });

    it('should return issues', async () => {
      const { issues } = await getIssues({ labels, token, dryRun: false });
      expect(issues).toHaveLength(1);
    });
  });

  describe('closing issues', () => {
    it('should close issues', async () => {
      jest.spyOn(http, 'post').mockImplementation(() => {});
      jest.spyOn(http, 'patch').mockImplementation(() => {});
      const issues = [{ number: '1' }, { number: '2' }];

      await closeIssues({ issues, version, token });

      expect(http.post).toHaveBeenCalledTimes(2);
      expect(http.patch).toHaveBeenCalledTimes(2);
    });
  });

  describe('removing issues', () => {
    it('should remove issues', async () => {
      jest.spyOn(http, 'remove').mockImplementation(() => {});
      const issues = [{ number: '1' }, { number: '2' }];

      await removeLabels({ issues, token });

      expect(http.remove).toHaveBeenCalledTimes(2);
    });
  });
});
