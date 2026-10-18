module.exports = {
  customSyntax: 'postcss-scss',
  rules: {
    'color-no-hex': true,
  },
  overrides: [
    {
      files: ['src/theme/**/*.scss'],
      rules: {
        'color-no-hex': null,
      },
    },
  ],
};
