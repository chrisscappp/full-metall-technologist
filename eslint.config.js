import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  globalIgnores(['src-tauri/**/*.js', 'node_modules/*', 'dist/*']),
  {
    plugins: {
      'react-hooks': reactHooks
    },
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-var': 'off'
		},
	},
])
