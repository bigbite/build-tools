const webpack = require('webpack');
const { terminal } = require('terminal-kit');
// eslint-disable-next-line import/no-extraneous-dependencies
const ora = require('ora');

const webpackConfig = require('./build/webpack');

const spinner = ora();

const { getFilteredEntryPoints } = require('./../utils/get-filtered-entrypoints');
const getProjectConfig = require('../utils/get-project-config');
const getPackagesForCommand = require('../utils/get-packages-for-command');

global.buildCount = 0;

exports.command = 'build [projects] [production] [once] [site] [quiet]';
exports.desc = 'Run a new build process.';
exports.builder = (yargs) => {
  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });

  yargs.option('production', {
    describe: `Build and compile production assets.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('once', {
    describe: `Only run the process once.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('site', {
    describe: `Run the process from the root of a site, such as from wp-content.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('quiet', {
    describe: `Limit the amount of noise by removing webpack output.`,
    default: false,
    type: 'boolean',
  });
};

exports.handler = async ({
  projects = '',
  site = false,
  production = false,
  once = false,
  quiet = false,
}) => {
  const mode = production ? 'production' : 'development';

  const packages = getPackagesForCommand({
    projects,
    site,
  });

  spinner.start('Building webpack configs.\n');

  const configMap = packages.map((packageObject) => {
    // Empty array means all entrypoints.
    let filteredEntrypoints = [];

    if (projects.startsWith('@')) {
      // Handle entrypoints when for standalone builds and all project builds.
      filteredEntrypoints = projects.split('@')[1].split('+');
    } else {
      // Handle entrypoints for each specified project build.
      filteredEntrypoints = getFilteredEntryPoints(projects)[packageObject.name];
    }

    const projectConfig = getProjectConfig(packageObject, mode, filteredEntrypoints);

    return webpackConfig(projectConfig, mode);
  });

  let previousHash = '';
  const compileSpinner = spinner.start('Compiling...');

  const compilerCallback = (err, stats) => {
    const { hash } = stats.stats[0];

    spinner.clear();

    if (err) {
      spinner.fail();
      process.stdout.write(err);
    }

    if (stats.hasErrors() && mode === 'production') {
      process.stdout.write(stats.toString() + '\n\n\n\n');
      spinner.fail('Build cancelled.');
      process.exit(1);
    }

    /**
     * Avoids output which is a symptom in a longstanding
     * webpack issue where the watcher can loop due to FS_ACCURENCY
     * constant in the webpack core. There are a number of suggested
     * fixes here: https://github.com/webpack/watchpack/issues/25
     *
     * None of those suggested fixes seem to work, however, in the
     * multiple builds, the hash remains the same, so we can avoid
     * the output by checking against a previous hash and returning
     * early if hashes match, avoiding multiple of the same output.
     */
    if (previousHash === hash) {
      return;
    }

    if (!quiet) {
      process.stdout.write(
        stats.toString({
          chunks: true,
          colors: true,
          preset: 'minimal',
        }),
      );

      previousHash = hash;

      terminal('\n\n');
    } else {
      spinner.succeed('Build complete.');
    }

    if (once) {
      terminal('\n\n');
      spinner.succeed('Build complete.');
    } else {
      compileSpinner.text = 'Watching...';
    }
  };

  const compiler = webpack(configMap);

  if (!once) {
    const watchConfig = {
      aggregateTimeout: 300,
    };
    compiler.watch(watchConfig, compilerCallback);
  } else {
    compiler.run(compilerCallback);
  }
};
