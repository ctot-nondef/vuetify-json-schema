// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    'object-curly-newline': ["off"],
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "never", "allow": [] }],
    "no-param-reassign": ["error", { "props": false }],
    "no-prototype-builtins": "off",
    "no-restricted-syntax": "off",
    "default-case": "off",
    "guard-for-in": "off",
    "no-shadow": "off",
    "no-nested-ternary": "off",
    "no-case-declarations":"off",
    "no-confusing-arrow":"off",
    "import/prefer-default-export":"off",
    "import/no-named-as-default-member":"off",
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
