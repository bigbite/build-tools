# CLI Command Usage

- [CLI Command Usage](#cli-command-usage)
  - [`build-tools build`](#build-tools-build)
    - [Individual Projects](#individual-projects)
    - [Individual entrypoints](#individual-entrypoints)
    - [Site-wide](#site-wide)
  - [`build-tools install`](#build-tools-install)
  - [`build-tools ci`](#build-tools-ci)

## `build-tools build`

Runs the build process.

| **Positionals** | | |
|:--|:--|:--|
| `projects` | _optional_ | Comma separated list of projects to build. _[[usage](#individual-projects)]_ |

| **Options** | |
|:--|:--|
| `--once` | Run the build process only once. |
| `--production` | Compile the assets for production. |
| `--quiet` | Runs the build process with reduced output. |

### Individual Projects
You can define a project by using the `project` positional when using the build command by placing the project name after the `build` command.

```bash
build-tools build my-plugin
```

The `project` positional can also take comma separated values if you need to build more than one project at a given time.

```bash
build-tools build my-plugin,my-theme
```

Notice that each defined project is not a full path, nor an entry point. We use the directory name as the project and the build tools then look for those as defined in the [Structuring Your Project guide](https://github.com/bigbite/build-tools/wiki/Project-Structuring), seeking through `client-mu-plugins`,`plugins` and `themes`.

### Individual entrypoints
You can define specific entrypoints to build by specifying them after `@` symbol and seperating entrypoints by `+` symbol.

Build all frontend entrypoints
```bash
build-tools build @frontend+editor
```

Build single project entrypoitns
```bash
build-tools build my-plugin@frontend
```

### Site-wide
If you need to build an entire sites worth of projects, which will often be the case come deployment, you can build all applicable projects by running the command from within your `wp-content` directory.

```bash
build-tools build
```

## `build-tools install`

Recursively runs the npm command `install` within any directory compatible with `projects` used for `build`. The command does not accept any additional arguments directly by will instead pass them through to npm.

```bash
build-tools install
build-tools install --dry-run
```

See [npm-install documentation](https://docs.npmjs.com/cli/v9/commands/npm-instal) for further information on accepted arguments.

## `build-tools ci`

Recursively runs the npm command `ci` within any directory compatible with `projects` used for `build`. The command does not accept any additional arguments directly by will instead pass them through to npm.

See [npm-ci documentation](https://docs.npmjs.com/cli/v9/commands/npm-ci) for further information on accepted arguments.

This command should not be used as a replacement for `npm-install` or `build-tools install` unless working in a CI/CD environment. See except of the `npm-ci` documentation description:

> [...] to be used in automated environments such as test platforms, continuous integration, and deployment -- or any situation where you want to make sure you're doing a clean install of your dependencies.

```bash
build-tools ci
build-tools ci --dry-run
```
