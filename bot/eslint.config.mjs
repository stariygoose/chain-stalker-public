import promise from 'eslint-plugin-promise';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      promise,
      '@typescript-eslint': typescript,
    },
    rules: {
      'promise/always-return': 'off',
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
      'require-await': 'error',

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
];