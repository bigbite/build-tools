# Config
## Available Configs

* `browserlist`
* `eslint`
* `postcss`
* `prettier`
* `stylelint`

## Prettier
You will need to set the prettier config as prettier does not support the ability to assign a config through code. Add the build tools under the `prettier` key to your `package.json`.

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "prettier": "@bigbite/build-tools/configs/prettier",
  "dependencies": {}
}
```

## VSCode (or other Editor)
While most packages and config will work out of the box there are a number of configs that need defining to give yourself the best compatibility with your Editor setup. These include:

- Prettier
- ESLint

To get these working correctly with your Editor you simply need to reference them in your `package.json` as seen below for `prettier` and `eslintConfig` keys.

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "prettier": "@bigbite/build-tools/configs/prettier",
  "eslintConfig": {
    "extends": "./node_modules/@bigbite/build-tools/configs/eslint",
  },
  "dependencies": {}
}
```

## Additional Setup.
Copy/merge the applicable contents of the below files to their respective files in your project.

| From | To | Description |
|:--|:--|:--|
| `.gitignore.build-tools` | `.gitignore` | Build Tools may generate some files that don't need to be committed to a repo. They're listed in here. |