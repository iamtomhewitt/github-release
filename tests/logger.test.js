const log = require('../src/logger');

describe('logger', () => {

  it('logs info', () => {
    log.info('hello')
    log.success('hello')
    log.warn('hello')
    log.error('hello')
    log.dryRun('hello')
    expect(global.console.log).toHaveBeenCalledTimes(5)
  });
});
