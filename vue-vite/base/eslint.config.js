import js from '@eslint/js';
import ionic from '@ionic/eslint-config/recommended.js';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  ...defineConfigWithVueTs(
    {
      ignores: ['dist/**', 'android/**', 'ios/**', 'playwright-report/**', 'test-results/**', 'blob-report/**'],
    },
    js.configs.recommended,
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
  ),
  // Kept outside defineConfigWithVueTs: it treats `consistent-type-imports` as
  // type-aware and would turn on project-based parsing for every .ts file.
  // Note: @ionic/eslint-config only targets .ts/.tsx files, so <script> blocks in
  // .vue files get the Vue and TypeScript rules above but not the Ionic ones.
  ...ionic,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['tests/unit/**/*.spec.{js,ts}'],
    languageOptions: {
      globals: globals.vitest,
    },
  },
];
