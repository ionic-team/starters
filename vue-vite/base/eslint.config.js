import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginJs from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  pluginJs.configs.recommended,
  vueTsConfigs.recommended,
  {
    languageOptions: {
      globals: globals.node,

      ecmaVersion: 2020,
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  globalIgnores(['coverage', 'dist', 'ios', 'android'])
);
