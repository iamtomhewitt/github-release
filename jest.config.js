module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coveragePathIgnorePatterns: [
    'src/logger/index.js',
    'node_modules',
  ],
};
