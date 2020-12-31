const sinon = require('sinon');
const util = require('util');
const fs = require('fs');
const log = require('../src/logger');
const { generateVersion, writeVersion } = require('../src/version');

const { version } = require(`${process.cwd()}/package.json`);

util.promisify = jest.fn();

describe('version', () => {
  const logSuccessSpy = jest.spyOn(log, 'success');
  const logDryRunSpy = jest.spyOn(log, 'dryRun');

  describe('generation', () => {
    beforeEach(() => {
      sinon.restore();
      jest.clearAllMocks();
    });

    it('generates version', async () => {
      const { newVersion } = await generateVersion({});

      expect(newVersion).not.toBe(version);
      expect(logSuccessSpy).toHaveBeenCalled();
    });

    it('generates a version with an appendage', async () => {
      const { newVersion } = await generateVersion({ append: '-append' });

      expect(newVersion.endsWith('-append')).toBeTruthy();
      expect(logSuccessSpy).toHaveBeenCalled();
    });

    it('generates a version with an override', async () => {
      const { newVersion } = await generateVersion({ override: '1.2.3' });

      expect(newVersion).toBe('1.2.3');
      expect(logSuccessSpy).toHaveBeenCalled();
    });
  });

  describe('writing', () => {
    const newVersion = '1.2.3';

    beforeEach(() => {
      sinon.restore();
      jest.clearAllMocks();
    });

    it('writes version', async () => {
      sinon.stub(fs.promises, 'writeFile');

      await writeVersion({ newVersion, dryRun: false });

      expect(logSuccessSpy).toHaveBeenCalledWith('Wrote 1.2.3 to package.json and package-lock.json');
    });

    it('does not write version in dry run mode', async () => {
      sinon.stub(fs.promises, 'writeFile');

      await writeVersion({ newVersion, dryRun: true });

      expect(logSuccessSpy).not.toHaveBeenCalled();
      expect(logDryRunSpy).toHaveBeenCalledWith('Wrote 1.2.3 to package.json and package-lock.json');
    });
  });
});
