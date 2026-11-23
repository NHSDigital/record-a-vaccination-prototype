const eslint = require('@eslint/js')
const typescript = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const { defineConfig, includeIgnoreFile } = require('eslint/config')
const prettier = require('eslint-config-prettier')
const importPlugin = require('eslint-plugin-import-x')
const jsdoc = require('eslint-plugin-jsdoc')
const n = require('eslint-plugin-n')
const promise = require('eslint-plugin-promise')
const globals = require('globals')

const gitignorePath = `${__dirname}/.gitignore`

module.exports = defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['**/lib/**', '**/public/**']
  },
  {
    files: ['**/*.{cjs,js,mjs}'],
    plugins: {
      '@typescript-eslint': typescript,
      'import-x': importPlugin,
      jsdoc,
      n,
      promise
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        __dirname: 'readonly'
      },
      parser: typescriptParser,
      sourceType: 'commonjs'
    },
    settings: {
      jsdoc: {
        mode: 'typescript'
      }
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...jsdoc.configs['flat/recommended-typescript-flavor'].rules,
      ...n.configs['flat/recommended'].rules,
      ...promise.configs['flat/recommended'].rules,
      ...typescript.configs.strict.rules,
      ...typescript.configs.stylistic.rules,

      // Check import or require statements are A-Z ordered
      'import-x/order': [
        'error',
        {
          'alphabetize': { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // Always import Node.js built-ins using the node: protocol
      'n/prefer-node-protocol': 'error',

      // Check for valid formatting
      'jsdoc/check-line-alignment': [
        'warn',
        'never',
        {
          wrapIndent: '  '
        }
      ],

      // JSDoc blocks are optional by default
      'jsdoc/require-jsdoc': 'off',

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

      // JSDoc @param required in (optional) blocks but
      // @param description is not necessary by default
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param': 'off',

      // JSDoc @returns is optional
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'off',

      // Maintain new line after description
      'jsdoc/tag-lines': [
        'warn',
        'never',
        {
          startLines: 1
        }
      ]
    }
  },
  {
    files: ['**/*.{cjs,js}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'n/no-unpublished-require': 'off'
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module'
    },
    rules: {
      'import-x/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            cjs: 'always',
            js: 'always',
            mjs: 'always'
          }
        }
      ]
    }
  },
  {
    files: ['app/assets/**/*.{cjs,js,mjs}'],
    ignores: ['app/assets/**/*.test.{cjs,js,mjs}'],
    languageOptions: {
      ecmaVersion: 2015,
      globals: globals.browser
    }
  },
  prettier
])
