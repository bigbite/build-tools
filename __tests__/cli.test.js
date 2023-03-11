'use strict';
const path = require('path');
const mockFs = require('mock-fs');

jest.mock('ora', () => () => ({
  start: jest.fn(),
}));

const requiredRealDirs = {
  node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
  src: mockFs.load(path.resolve(__dirname, '../src')),
  configs: mockFs.load(path.resolve(__dirname, '../configs')),
};

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
      return webpack;
    });
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.stdout.write = originalWrite;
    process.exit = originalExit;

    mockFs.restore();
    jest.resetAllMocks();
  });

  it('detects single project mode based on filesystem', () => {
    mockFs({
      ...requiredRealDirs,
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
    mockFs({
      ...requiredRealDirs,
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
    mockFs({
      ...requiredRealDirs,
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

  it('fails to run specific projects mode when requested if not found', () => {
    mockFs({
      ...requiredRealDirs,
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

    expect(mockWebpack).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in development mode.\x1b[0m\n`,
    );
    expect(process.stdout.write).toHaveBeenCalledWith('Processing the following projects:\n');
    expect(process.stdout.write).toHaveBeenCalledWith(`Error: Project my-theme does not exist.`);
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
