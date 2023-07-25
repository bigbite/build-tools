const path = require('path');
const mockFs = require('mock-fs');

const { findProjectPath, findAllProjectPaths } = require('../projectpaths');

const srcEntrypoints = {
  src: {
    entrypoints: 'test',
  },
};

const packageJson = {
  'package.json': JSON.stringify({
    name: 'my-project',
  }),
};

describe('Project paths', () => {
  beforeEach(() => {
    jest.resetModules();

    originalWrite = process.stdout.write;
    originalExit = process.exit;

    process.stdout.write = jest.fn();
    process.exit = jest.fn();
  });

  afterEach(() => {
    process.stdout.write = originalWrite;
    process.exit = originalExit;

    jest.resetAllMocks();
  });

  beforeAll(() => {
    mockFs({
      node_modules: mockFs.load(path.resolve(__dirname, '../../../node_modules')),
      ...srcEntrypoints,
      ...packageJson,
      plugins: {
        'plugin-with-src-entrypoints': srcEntrypoints,
        'plugin-with-package-json': packageJson,
        'plugin-with-both': {
          ...srcEntrypoints,
          ...packageJson,
        },
        'plugin-with-none': {},
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  describe('findAllProjectPaths', () => {
    it('should throw error when no projects exist', () => {
      expect(() => findAllProjectPaths(['client-mu-plugins'])).toThrowError(
        'Cannot find any projects.',
      );
    });

    it('should return all project paths that have package.json', () => {
      const targetDirs = ['client-mu-plugins', 'plugins', 'themes'];

      const result = findAllProjectPaths(targetDirs);
      const expected = [
        path.resolve(`./plugins/plugin-with-both`),
        path.resolve(`./plugins/plugin-with-package-json`),
      ];

      expect(result).toEqual(expected);
    });

    it('should not return projects that do not contain a package.json', () => {
      const targetDirs = ['client-mu-plugins', 'plugins', 'themes'];

      const result = findAllProjectPaths(targetDirs);

      expect(result).toContain(path.resolve(`./plugins/plugin-with-package-json`));
      expect(result).not.toContain(path.resolve(`./plugins/plugin-with-none`));
      expect(result).not.toContain(path.resolve(`./plugins/plugin-with-src-entrypoints`));
    });
  });
});
