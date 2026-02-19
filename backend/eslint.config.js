import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  pluginJs.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    // ignorar pastas específicas
    ignores: ['node_modules/', 'dist/'],
  },
];
