module.exports = {
  plugins: ['stylelint-scss', 'stylelint-use-logical'],
  customSyntax: 'postcss-scss',
  rules: {
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'function-calc-no-unspaced-operator': true,
    'value-no-vendor-prefix': true,
    'declaration-block-single-line-max-declarations': 1,
    'block-no-empty': true,
    'selector-pseudo-element-colon-notation': 'double',
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-no-duplicate-properties': true,
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-blockless',
          'blockless-after-same-name-blockless',
          'first-nested',
        ],
        ignore: ['after-comment'],
        ignoreAtRules: ['else', 'elseif'],
      },
    ],
    'comment-empty-line-before': [
      'always',
      {
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-else-closing-brace-space-after': 'always-intermediate',
    'scss/at-else-empty-line-before': 'never',
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-if-closing-brace-space-after': 'always-intermediate',
    "csstools/use-logical": "always",
  },
};
