module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 8
    },
    env: {
        node: true,
        es6: true
    },

    extends: 'pedant',

    overrides: [
        {
            files: ['*.spec.js'],
            env: { mocha: true },
            rules: {
                'no-unused-expressions': 0
            }
        }
    ]
};
