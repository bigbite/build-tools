'use strict';
const { vol: mockVol } = require('memfs');
const { ufs: mockUfs } = require('unionfs');

jest.mock('fs', () => {
  // combine the virtual file system with the real one so we can use both at the same time.
  return mockUfs.use(jest.requireActual('fs')).use(mockVol);
});

jest.mock('ora', () => () => ({
  start: jest.fn(),
}));

describe('CLI Build Command', () => {
  let originalArgv;
  let originalWrite;
  let originalExit;

  let mockWebpack;

  beforeEach(() => {
    jest.resetModules();

    originalArgv = process.argv;
    originalWrite = process.stdout.write;
    originalExit = process.exit;

    process.stdout.write = jest.fn();
    process.exit = jest.fn();

    mockWebpack = jest.fn().mockImplementation((config) => {
      return {
        run: jest.fn(),
        watch: jest.fn(),
      };
    });
    jest.mock('webpack', () => {
      const webpack = mockWebpack;
      webpack.DefinePlugin = jest.fn().mockImplementation((params) => params);
      webpack.ExternalsPlugin = jest.fn().mockImplementation((params) => params);
      webpack.version = '4.0.0';
      webpack.util = {
        createHash: jest.fn(),
      };
      webpack.sources = {
        RawSource: jest.fn(),
      };

      return webpack;
    });
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.stdout.write = originalWrite;
    process.exit = originalExit;

    mockVol.reset();
    jest.resetAllMocks();
  });

  it('can read global vars', () => {
    mockVol.fromNestedJSON({
      'src/entrypoints': {
        'some-file.js': 'console.log("file content here");',
        'empty-dir': {
          /** empty directory */
        },
      },
      'package.json': JSON.stringify({
        name: 'test-project',
      }),
    });

    runCommand('build', '--once');

    const packagePath = process.cwd() + '/package.json';

    expect(global.targetDirs).toEqual(['client-mu-plugins', 'plugins', 'themes']);
    expect(global.packageList).toEqual({
      [packagePath]: {
        absolutePath: packagePath,
        json: { name: 'test-project' },
        name: 'test-project',
        path: process.cwd(),
        relativePath: 'build-tools/package.json',
      },
    });
  });

  it('detects single project mode based on filesystem', () => {
    mockVol.fromNestedJSON({
      'src/entrypoints': {
        'some-file.js': 'console.log("file content here");',
        'empty-dir': {
          /** empty directory */
        },
      },
      'package.json': JSON.stringify({
        name: 'test-project',
      }),
    });

    runCommand('build', '--once');

    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4msingle\x1b[0m\x1b[1m project in development mode.\x1b[0m\n`,
    );
  });

  it('detects all projects mode based on filesystem', () => {
    mockVol.fromNestedJSON({
      plugins: {
        'my-plugin': {
          'package.json': JSON.stringify({
            name: 'my-plugin',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
    });

    runCommand('build', '--once');

    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mall\x1b[0m\x1b[1m projects in development mode.\x1b[0m\n`,
    );
  });

  it('runs specific projects mode when requested', () => {
    mockVol.fromNestedJSON({
      plugins: {
        'my-plugin': {
          'package.json': JSON.stringify({
            name: 'my-plugin',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
      themes: {
        'my-theme': {
          'package.json': JSON.stringify({
            name: 'my-theme',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
      'client-mu-plugins': {},
    });

    runCommand('build', '--once', 'my-plugin,my-theme');

    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in development mode.\x1b[0m\n`,
    );
    expect(process.stdout.write).toHaveBeenCalledWith('Processing the following projects:\n');
    expect(process.stdout.write).toHaveBeenCalledWith(` * my-plugin `);
    expect(process.stdout.write).toHaveBeenCalledWith(` * my-theme `);
  });

  it('runs specific projects and entrypoints mode when requested', () => {
    mockVol.fromNestedJSON({
      plugins: {
        'my-plugin': {
          'package.json': JSON.stringify({
            name: 'my-plugin',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
              'frontend.js': 'console.log("file content here");',
            },
          },
        },
      },
      themes: {
        'my-theme': {
          'package.json': JSON.stringify({
            name: 'my-theme',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
      'client-mu-plugins': {},
    });

    runCommand('build', '--once', 'my-plugin@frontend,my-theme');

    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in development mode.\x1b[0m\n`,
    );
    expect(process.stdout.write).toHaveBeenCalledWith('Processing the following projects:\n');
    expect(process.stdout.write).toHaveBeenCalledWith(` * my-plugin `);
    expect(process.stdout.write).toHaveBeenCalledWith(` * my-theme `);
  });

  it('runs specific projects mode if some requested projects are not found', () => {
    mockVol.fromNestedJSON({
      plugins: {
        'my-plugin': {
          'package.json': JSON.stringify({
            name: 'my-plugin',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
    });

    runCommand('build', '--once', 'my-plugin,my-theme');

    expect(process.stdout.write).toHaveBeenCalledWith(`Error: Project my-theme does not exist.\n`);
    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in development mode.\x1b[0m\n`,
    );
    expect(process.stdout.write).toHaveBeenCalledWith('Processing the following projects:\n');
    expect(process.stdout.write).toHaveBeenCalledWith(` * my-plugin `);
  });

  it('fails to run specific projects mode if no requested projects can be found', () => {
    mockVol.fromNestedJSON({
      plugins: {
        'my-plugin': {
          'package.json': JSON.stringify({
            name: 'my-plugin',
          }),
          src: {
            entrypoints: {
              'some-file.js': 'console.log("file content here");',
            },
          },
        },
      },
    });

    runCommand('build', '--once', 'my-client-plugin,my-theme');

    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in development mode.\x1b[0m\n`,
    );
    expect(process.stdout.write).toHaveBeenCalledWith(`Error: No projects found\n`);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});

async function runCommand(...args) {
  process.argv = [
    'node', // Not used but a value is required at this index in the array
    'cli.js', // Not used but a value is required at this index in the array
    ...args,
  ];
  return require('../src/cli.js');
}
