# Upgrading from Build Tools v1

## Handling lint differences

There are several new lint rules in place that weren't present in v1 of the build-tools, and some of these can generate a lot of noise. However many are also automatically fixable. If you're upgrading an existing project, presuming you have set up prettier and eslint to use [our config](Config.md), you can run `npx eslint ./src --fix` to detect and fix all auto-fixable issues.

## `build` directory is now `dist`

This aligns with wp-scripts naming conventions and ensures that wp-scripts works as expected. For example, certain actions will auto-ignore files in the `dist` directory.

## `asset-settings.php` is no longer used

v1 of the build tools generated a file at `inc/asset-settings.php`. This is no longer created, so any references to this file in your project should be removed. This file is usually not tracked in VCS, but if it is, or if it exists for you locally, you should remove it.

## SVG import syntax has changed

If you're using SVG files in JavaScript, the syntax to import assets has changed to match wp-scripts. There are two ways to import an SVG:

- As a React Component: `import { ReactComponent as IconComponent } from './icon.svg';`
- As a URL: `import iconURL from './icon.svg';`

## Static directory is no longer copied to `dist`

We previously used a `src/static` directory to copy files from `src` to `build`. This is no longer required.

Fonts and images imported into JavaScript files will be transformed and moved to `build` regardless of where they are located. Any other files that you want to have available should reside in a `static` directory which is not inside of the `src` directory, and not processed at all by the tooling.

## Block registration

Block registration has been simplified due to the use of wp-scripts. Block source code should reside in `src/blocks/{block-name}` and include a `block.json` file which references assets by file path. JavaScript, (S)CSS and even PHP should be located in the block directory, and the tooling will handle processing of all files into `dist/blocks/{block-name}`.

You can review the [WordPress docs](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) for more information on how `block.json` and assets work.
