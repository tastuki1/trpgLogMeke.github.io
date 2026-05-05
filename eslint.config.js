import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import jsdoc from 'eslint-plugin-jsdoc'

export default [
  {
    ignores: ['dist', 'node_modules', 'legacy'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      jsdoc: {
        mode: 'typescript',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jsdoc,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // JSDoc ルール: TypeScript モードで型アノテーション不要
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
          ],
        },
      ],
      'jsdoc/require-description': ['warn', {
        contexts: ['FunctionDeclaration', 'TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
      }],
      'jsdoc/require-param': ['warn', { enableFixer: false, checkDestructured: false }],
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns': ['warn', { checkGetters: false }],
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
      'jsdoc/check-tag-names': ['warn', { jsxTags: false }],
      'jsdoc/no-blank-blocks': 'warn',
    },
  },
  {
    // React コンポーネントは Props 型と JSX の戻り型が自明なため緩和
    files: ['**/*.tsx'],
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
          ],
        },
      ],
      'jsdoc/require-description': ['warn', {
        contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
      }],
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
]
