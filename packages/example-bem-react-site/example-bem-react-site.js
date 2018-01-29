const agrariumPresetBem = require('@agrarium/preset-bem-react');

agrariumPresetBem({
    blocks: {
        src: ['src/blocks']
    },
    pages: {
        i18n: {
            default: 'en',
            langs: ['ru', 'en', 'uk']
        },
        output: './src/docs/data.json'
    },
    inlineExamples: {
        src: ['src/blocks'],
        langs: ['js', 'react'],
        output: './src/docs/examples',
        publicPath: '/examples'
    }
});
