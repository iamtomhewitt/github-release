const log = require("../src/logger");

describe('logger', () => {
  it('logs without errors', async () => {
    log.dryRun('test');
    log.warn('test');
    log.error('test');
    log.info('test');
    log.success('test');
  });
});