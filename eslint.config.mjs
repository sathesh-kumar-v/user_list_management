import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Airbnb style rules (manually copied since Flat Config doesn't support "extends")
      'react/jsx-uses-react': 'off', // React 17+
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',

      // Recommended best practices (can add more as needed)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/no-unresolved': 'error',
      'jsx-a11y/alt-text': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig, // Make sure Prettier rules override conflicting ones
];
