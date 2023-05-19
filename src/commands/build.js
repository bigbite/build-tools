const path = require('path');
const webpack = require('webpack');
const { terminal } = require('terminal-kit');
// eslint-disable-next-line import/no-extraneous-dependencies
const ora = require('ora');
const webpackConfig = require('./build/webpack');

const spinner = ora();

const { findProjectPath, findAllProjectPaths } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');
const dirsExist = require('../utils/dirs-exist');

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
  const currentLocation = path.basename(process.cwd());

  const mode = production ? 'production' : 'development';
  // Use env variables if working on Webpack >=5.
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = (site || hasTargetDirs) && !projects;

  let paths = [];

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      // Is project root - a standalone build.
      terminal(`\x1b[1mCompiling \x1b[4msingle\x1b[0m\x1b[1m project in ${mode} mode.\x1b[0m\n`);
      paths.push(path.resolve('./'));
    } else if (isAllProjects) {
      // Find all projects through-out the site.
      terminal(`\x1b[1mCompiling \x1b[4mall\x1b[0m\x1b[1m projects in ${mode} mode.\x1b[0m\n`);
      paths = findAllProjectPaths(targetDirs);
    } else {
      // List of projects.
      terminal(`\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in ${mode} mode.\x1b[0m\n`);
      // Compile all project paths into array.
      paths = projectsList.map((projectItem) => findProjectPath(projectItem, targetDirs));
    }
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }

  let packages = [];

  try {
    packages = paths.map((item) => getPackage(item, false)).filter((item) => item);
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }

  terminal('Processing the following projects:\n');
  packages.forEach((pkg) => {
    terminal.defaultColor(` * %s `, pkg.name).dim(`[%s]\n`, pkg.relativePath);
  });
  terminal('\n');

  spinner.start('Building webpack configs.\n');

  const configMap = packages.map((packageObject) => {
    /**
     * Project config holds all information about a particular project,
     * rather than directly pulling out paths from files or attempting
     * to build them, use what is here.
     */
    const PROJECT_CONFIG = {
      name: packageObject.name,
      version: packageObject.json.version,
      paths: {
        project: path.resolve(packageObject.path),
        config: path.resolve(`${__dirname}/configs`),
        src: path.resolve(`${packageObject.path}/src`),
        dist: path.resolve(`${packageObject.path}/dist`),
        clean: [
          `${packageObject.path}/dist/scripts`,
          `${packageObject.path}/dist/styles`,
          `${packageObject.path}/dist/static`,
        ],
        node_modules: path.resolve(packageObject.path, 'node_modules'),
      },
      clean: true,
      copy: true,
      mode,
    };

    let customWebpackConfig = {
      extends: true,
    };
    let config = webpackConfig(PROJECT_CONFIG, mode);

    try {
      customWebpackConfig = {
        ...customWebpackConfig,
        ...require(PROJECT_CONFIG.paths.project + '/webpack.config.js'),
      };
    } catch (e) {}

    if (!customWebpackConfig?.extends) {
      config = customWebpackConfig;
    } else if (customWebpackConfig) {
      config = {
        ...config,
        ...customWebpackConfig,
      };
    }

    delete config.extends;

    return config;
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
