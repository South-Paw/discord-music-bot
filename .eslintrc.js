module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    node: true
  },
  plugins: ['jest', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',

    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',

    // Rules below are all added to remove conflicts with prettier. DO NOT REMOVE
    'arrow-parens': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true
      }
    }
  ]
};
