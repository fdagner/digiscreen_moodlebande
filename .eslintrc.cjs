/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'generator-star-spacing': 'off',
    'vue/no-multiple-template-root': 'off',
    'indent': [
      'error',
      'tab'
    ],
    'no-tabs': 0,
    'no-console': 0
  }
}
