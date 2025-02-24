const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const scenarios = require('../__fixtures__/build-scenarios');

describe('CLI Build Command', () => {
  const cliPath = path.resolve(__dirname, '../src/cli.js');
  const fixturesBasePath = path.join(__dirname, '../__fixtures__');

  /**
   * Clean the contents of a directory
   *
   * @param {string} dir The path to the directory to clean
   */
  const cleanDir = (dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  };

  /**
   * Run the build command
   *
   * @param {string} fixturePath The path to the fixture
   */
  const runBuild = (fixturePath) => {
    return execSync(`node ${cliPath} build --once`, {
      cwd: fixturePath,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
  };

  scenarios.forEach(({ name, expectedFiles, expectedProjects }) => {
    describe(`Fixture: ${name}`, () => {
      const fullFixturePath = path.join(fixturesBasePath, name);

      /**
       * Clean build output before each test
       */
      beforeEach(() => {
        expectedProjects.forEach((projectPath) => {
          cleanDir(path.join(fullFixturePath, projectPath, 'dist'));
          cleanDir(path.join(fullFixturePath, projectPath, 'inc'));
        });
      });

      test('generates expected files', () => {
        try {
          const output = runBuild(fullFixturePath);
          console.log(`Build output for ${name}:`, output);

          expectedFiles.forEach((filePath) => {
            const exists = fs.existsSync(path.join(fullFixturePath, filePath));
            expect(exists).toBe(true, `Expected file ${filePath} to exist in ${fullFixturePath}`);

            // Add snapshot verification
            // const fileContent = fs.readFileSync(path.join(fullFixturePath, filePath), 'utf8');
            // expect(fileContent).toMatchSnapshot();
          });
        } catch (error) {
          console.error(`Build error in ${name}:`, error.message);
          console.error('Command output:', error.stdout?.toString());
          console.error('Command stderr:', error.stderr?.toString());
          throw error;
        }
      });
    });
  });
});
