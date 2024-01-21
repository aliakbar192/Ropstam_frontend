module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['google', 'prettier', 'plugin:react/recommended'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'require-jsdoc': 'off',
        camelcase: 'off',
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    plugins: ['react-hooks'],

    settings: {
        react: {
            version: 'latest',
        },
    },
};
