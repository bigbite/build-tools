# Project Structuring

## Projects

The build tools allows you to work with multiple projects at a time. Each project you're attempting to build should have at least one entrypoint and a `package.json` with at least a name and version set. Lets say we have 3 projects, 2 plugins and a theme, spread across a WordPress VIP site, we would have the following directory structure (assuming root is `wp-content`):

```
/client-mu-plugins
  /my-plugin
/plugins
  /another-cutom-plugin
/themes
  /my-theme
```

By default, the build tools will scan the `client-mu-plugins`, `plugins`, and `themes` directories for valid projects.

If these directories are not found, the tool will assume you are currently in a single plugin/theme/project and build only those assets.

## Entrypoints

For each project detected by the build tools, the `src/entrypoints` directory will be scanned and every file/directory within will be used as the basis for building a bundle of assets.

This means that each project can have multiple entrypoints, for example one for enqueueing in wp-admin, and another for the frontend:

```
/client-mu-plugins
  /my-plugin
    /package.json
    /src
      /entrypoints
        /editor.js
        /frontend.js
/plugins
  /another-cutom-plugin
    /package.json
    /src
      /entrypoints
        /editor.js
/themes
  /my-theme
    /package.json
    /src
      /entrypoints
        /frontend.js
```

In this example, each project (plugin/theme) has their own directory with one or more entrypoint files inside. This allows us target specific projects for any build and to work on a single project (or multiple if you need to) in isolation, not having to worry or wait for all other plugins as part of the build.

## Blocks

Blocks can be built by including a `src/blocks` directory in a project. Each sub-directory within should contain a `block.json` file, and whichever assets you want to include alongside this:

```
/src
  /blocks
    /my-block
      block.json
    /my-other-block
      block.json
```

Blocks are built using `@wordpress/scripts`, the detection and handling of assets is based around this.
