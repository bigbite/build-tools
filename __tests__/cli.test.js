'use strict';
const path = require('path');
const mock = require('mock-fs');

jest.mock('ora', () => () => ({
  start: jest.fn(),
}));

const mockWebpack = jest.fn().mockImplementation((config) => {
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

describe('CLI', () => {
  let originalArgv;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
    jest.resetModules();
    originalArgv = process.argv;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.resetAllMocks();
    process.argv = originalArgv;
  });

  beforeAll(() => {
    mock({
      node_modules: mock.load(path.resolve(__dirname, '../node_modules')),
      src: mock.load(path.resolve(__dirname, '../src')),
      configs: mock.load(path.resolve(__dirname, '../configs')),
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
  });

  afterAll(() => {
    mock.restore();
  });

  it('runs the build command', () => {
    runCommand('build', '--once');
    expect(mockWebpack).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      `\x1b[1mCompiling \x1b[4msingle\x1b[0m\x1b[1m project in development mode.\x1b[0m\n`,
    );
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
