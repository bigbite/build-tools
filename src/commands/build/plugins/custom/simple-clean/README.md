# Simple Clean Webpack Plugin

A simple webpack plugin for cleaning files and directories in your build process.

## Options

```js
{
    // Show output to CLI during clean processes
    // default: false
    verbose: true,
    // Paths to clean on the inital run when in watch, or on build when not.
    // default: []
    initialCleanPaths: [
        '/dist/scripts',
    ],
    // Remove directories that are empty after clearing files.
    // default: true
    removeEmptyDirectories: true,
}
```
