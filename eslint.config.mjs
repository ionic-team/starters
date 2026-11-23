import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    // The old script ran with --ext .ts, so only TypeScript was linted. Flat config
    // also picks up .js/.mjs/.cjs by default, so ignore those to keep the same scope.
    ignores: [
      '**/*.{js,mjs,cjs}',
      '**/node_modules',
      '**/*.d.ts',
      '**/angular',
      '**/vue',
      '**/react',
      '**/integrations',
      '**/ionic-angular',
      '**/ionic1',
      '**/dist',
      '**/build',
      '**/vue-vite',
      '**/react-vite',
      '**/angular-standalone',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
