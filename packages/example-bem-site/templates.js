const { bemtree } = require('bem-xjst');

module.exports = bemtree.compile(function() {
    block('root').replace()(function(_, { agrarium, lang, i18n }) {
        const blockName = agrarium.chunk.key;
        const blocksList = agrarium.data.list.blocks;
        const menuItems = blocksList
            .sort((a, b) => a > b)
            .map(bN => ({
                url: `${bN}.${lang}.html`,
                text: bN
            }));

        return ({
            block: 'page',
            title: `Block ${blockName}`,
            favicon: '//bem.info/favicon.ico',
            head: [
                { elem: 'css', url: `${blockName}.css` },
                { elem: 'js', url:  `${blockName}.js` },
                { elem: 'meta', attrs: { name: 'keywords', content: `Block ${blockName}` } }
            ],
            content: [
                {
                    elem: 'menu',
                    content: menu(menuItems)
                },
                {
                    elem: 'content',
                    agrarium,
                    lang,
                    i18n
                }
            ]
        });
    });

    block('page').elem('content').content()(function(_, { agrarium, lang, i18n }) {
        return [
            { tag: 'h1', content: agrarium.chunk.key },

            agrarium.data.markdown
                .filter(file => file.lang === lang || file.lang === i18n.default)
                .map(({ content }) => ({ content })),

            menu(agrarium.chunk.files.sort((a, b) => a.id > b.id).map(sourceFile => ({
                text: sourceFile.id,
                url: sourceFile.path
            })))
        ];
    });

    function menu(items) {
        return {
            block: 'menu',
            mods: { mode: 'navigation', theme: 'islands', size: 'l' },
            content: items.map(item => ({
                elem: 'item',
                mods: { type: 'link' },
                content: {
                    block: 'link',
                    url: item.url,
                    content: item.text
                }
            }))
        };
    }
});
