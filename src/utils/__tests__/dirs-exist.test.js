const mockFs = require('mock-fs');
const process = require('process');

const dirsExist = require('../dirs-exist');

afterEach(() => {
  mockFs.restore();
});

describe('Dirs exist', () => {
  it("Throws an error if targetDirs isn't an array", () => {
    expect(() => dirsExist(123)).toThrow('Expected an array.');
  });

  it('Throws an error if targetDirs is empty array', () => {
    expect(() => dirsExist([])).toThrow(
      'Expected dirExists to have at least 1 item passed in array.',
    );
  });

  it('Returns true if any of the passed dirs exist', () => {
    mockFs({
      'my-dir': {},
      'my-dir-two': {},
      'my-dir-three': {},
    });
    const result = dirsExist(['my-dir', 'my-other-dir']);
    expect(result).toEqual(true);
  });

  it('Returns false if none of the passed dirs exist', () => {
    mockFs({
      'my-dir': {},
      'my-dir-two': {},
      'my-dir-three': {},
    });
    const result = dirsExist(['some-dir', 'my-other-dir']);
    expect(result).toEqual(false);
  });
});
