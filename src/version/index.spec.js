const fs = require('fs');

const { generateVersion, writeVersion } = require('.');

const { version } = require(`${process.cwd()}/package.json`);

describe('version', () => {
  beforeEach(() => {
    jest.spyOn(fs.promises, 'writeFile');
    jest.spyOn(fs.promises, 'readFile');
    jest.clearAllMocks();

    fs.promises.writeFile = jest.fn();
    fs.promises.readFile = jest.fn().mockResolvedValueOnce('test');
  });

  describe('generateVersion', () => {
    it('should generate a version', async () => {
      const { newVersion } = await generateVersion({});
      expect(newVersion).not.toBe(version);
    });

    it('should generate a version with an appendage', async () => {
      const { newVersion } = await generateVersion({ append: '-append' });
      expect(newVersion.endsWith('-append')).toBeTruthy();
    });

    it('should generate a version with an override', async () => {
      const { newVersion } = await generateVersion({ override: '1.2.3' });
      expect(newVersion).toBe('1.2.3');
    });
  });

  describe('writeVersion', () => {
    const newVersion = '1.2.3';

    it('should write a new version', async () => {
      await writeVersion({ newVersion, dryRun: false });

      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should not write version in dry run mode', async () => {
      await writeVersion({ newVersion, dryRun: true });

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });
  });
});
