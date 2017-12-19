const agrariumPresetBem = require('@agrarium/preset-bem');

agrariumPresetBem({
    blocks: {
        src: [
            'node_modules/bem-components/common.blocks',
            'node_modules/bem-components/touch.blocks',
            'node_modules/bem-components/desktop.blocks',
            'node_modules/bem-components/design/common.blocks',
            'node_modules/bem-components/design/desktop.blocks'
        ]
    },
    pages: {
        src: [
            'node_modules/bem-core/common.blocks',
            'node_modules/bem-core/desktop.blocks',
            'node_modules/bem-components/common.blocks',
            'node_modules/bem-components/desktop.blocks',
            'node_modules/bem-components/design/common.blocks',
            'node_modules/bem-components/design/desktop.blocks',
        ],
        i18n: {
            default: 'en',
            langs: ['ru', 'en', 'uk']
        },
        templates: require('./templates'),
        output: './out'
    },
    inlineExamples: {
        src: [
            'node_modules/bem-core/common.blocks',
            'node_modules/bem-core/desktop.blocks',
            'node_modules/bem-components/common.blocks',
            'node_modules/bem-components/desktop.blocks',
            'node_modules/bem-components/design/common.blocks',
            'node_modules/bem-components/design/desktop.blocks',
        ],
        langs: ['js', 'bemjson'],
        output: './out/examples',
        publicPath: '/examples'
    }
});
