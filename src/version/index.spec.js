const fs = require('fs');
const sinon = require('sinon');
const util = require('util');
const log = require('../logger');
const { generateVersion, writeVersion } = require('.');

const { version } = require(`${process.cwd()}/package.json`);

util.promisify = jest.fn();

describe('version', () => {
  beforeEach(() => {
    jest.spyOn(log, 'success');
    jest.spyOn(log, 'dryRun');

    sinon.restore();
    jest.clearAllMocks();
  });

  describe('generation', () => {
    it('generates version', async () => {
      const { newVersion } = await generateVersion({});

      expect(newVersion).not.toBe(version);
      expect(log.success).toHaveBeenCalled();
    });

    it('generates a version with an appendage', async () => {
      const { newVersion } = await generateVersion({ append: '-append' });

      expect(newVersion.endsWith('-append')).toBeTruthy();
      expect(log.success).toHaveBeenCalled();
    });

    it('generates a version with an override', async () => {
      const { newVersion } = await generateVersion({ override: '1.2.3' });

      expect(newVersion).toBe('1.2.3');
      expect(log.success).toHaveBeenCalled();
    });
  });

  describe('writing', () => {
    const newVersion = '1.2.3';

    it('writes version', async () => {
      sinon.stub(fs.promises, 'writeFile');

      await writeVersion({ newVersion, dryRun: false });

      expect(log.success).toHaveBeenCalledWith('Wrote 1.2.3 to the above files!');
    });

    it('does not write version in dry run mode', async () => {
      sinon.stub(fs.promises, 'writeFile');

      await writeVersion({ newVersion, dryRun: true });

      expect(log.success).not.toHaveBeenCalled();
      expect(log.dryRun).toHaveBeenCalledWith('Wrote 1.2.3 to the above files!');
    });
  });
});
