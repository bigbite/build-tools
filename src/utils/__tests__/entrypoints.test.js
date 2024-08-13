const { vol } = require('memfs');
const process = require('process');

const entrypoints = require('../entrypoints');

jest.mock('fs');

afterEach(() => {
  vol.reset();
});

describe('Entrypoints', () => {
  it('Throws an error if entrypoints directory is not found relative to src', () => {
    const src = './';
    expect(() => entrypoints(src)).toThrow('Unable to find entrypoints folder in ./.');
  });

  it('Returns an entrypoints object if entrypoints directory is found relative to src', () => {
    vol.fromNestedJSON({
      entrypoints: {
        'some-file.js': 'console.log("file content here");',
        'empty-dir': {},
      },
    });
    const src = './';
    const result = entrypoints(src);
    const cwd = process.cwd();
    expect(result).toEqual({
      'empty-dir': `${cwd}/entrypoints/empty-dir`,
      'some-file': `${cwd}/entrypoints/some-file.js`,
    });
  });

  it('Returns an empty object if entrypoints directory is empty', () => {
    vol.fromNestedJSON({
      entrypoints: {},
    });
    const src = './';
    const result = entrypoints(src);
    expect(result).toEqual({});
  });
});
