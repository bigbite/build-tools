const path = require('path');
const mockFs = require('mock-fs');

const { getPackage } = require('../get-package');

beforeAll(() => {
  global.packageList = {};
  global.targetDirs = ['client-mu-plugins', 'plugins', 'themes'];
});
afterEach(() => {
  mockFs.restore();
});

describe('Get package', () => {
  it('Returns false if package.json is not found and throwError set to false', () => {
    const src = '';
    const result = getPackage(src, false);
    expect(result).toEqual(false);
  });

  it('Returns a package object if package.json is found', () => {
    mockFs({
      'package.json': JSON.stringify({ name: '@bigbite/test-package' }),
    });
    const src = '.';
    const result = getPackage(src, false);
    expect(result).toEqual({
      absolutePath: './package.json',
      json: {
        name: '@bigbite/test-package',
      },
      name: 'test-package',
      path: '.',
      relativePath: './package.json',
    });
  });
});
