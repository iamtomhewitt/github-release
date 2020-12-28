global.console = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  log: jest.fn(), // console.log are ignored in tests
  warn: console.warn,
};