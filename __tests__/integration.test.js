const { exec } = require('child_process');
const path = require('path');

const exampleSitePath = path.resolve(__dirname, '../example-site');

/**
 * Runs the CLI with the given arguments.
 *
 * @param {string} args The arguments to pass to the CLI
 * @param {string} cwd  The current working directory to run the command in
 *
 * @return {Promise<{error: Error|null, stdout: string, stderr: string}>}
 */
function runCli(args, cwd = exampleSitePath) {
  const cliPath = path.resolve(__dirname, '../src/cli.js');

  return new Promise((resolve) => {
    exec(`node ${cliPath} ${args}`, { cwd }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

describe('CLI Integration Tests', () => {
  it('installs projects', async () => {
    const { error } = await runCli('install');
    expect(error).toBeNull();
  }, 10000);

  it('installs projects with npm args', async () => {
    const { error } = await runCli('install -- --package-lock-only');
    expect(error).toBeNull();
  });

  it('runs ci install projects', async () => {
    const { error } = await runCli('ci');
    expect(error).toBeNull();
  }, 10000);

  it('compiles standards plugin', async () => {
    const { error } = await runCli('build standards --once --production');
    expect(error).toBeNull();
  });

  it('builds test-plugin and test-theme', async () => {
    const { error } = await runCli('build test-plugin,test-theme --once --production');
    expect(error).toBeNull();
  });

  it('builds site', async () => {
    const { error } = await runCli('build --site --once --production');
    expect(error).toBeNull();
  });

  it('builds single plugin', async () => {
    const pluginPath = path.resolve(exampleSitePath, 'plugins/test-plugin');
    const { error } = await runCli('build --once --production', pluginPath);
    expect(error).toBeNull();
  });
});
