const { bemtree } = require('bem-xjst');

module.exports = bemtree.compile(function() {
    block('root').def()(function(_, { key, files, components, md, lang }) {

        return applyCtx({
            block: 'page',
            title: `Компонент ${key}`,
            favicon: '//bem.info/favicon.ico',
            head: [
                { elem: 'css', url: `${key}.css` },
                { elem: 'js', url:  `${key}.js` },
                { elem: 'meta', attrs: { name: 'keywords', content: `Component ${key}` } }
            ],
            content: [
                menu(components.sort((a, b) => a > b).map(c => ({
                    text: c,
                    url: c + '.html', // ctx.lib.generateRoute({ component })
                }))),
                { block: 'page', elem: 'content', files, key, md, lang }
            ]
        });
    });

    block('page').elem('content').content()(function(_, { key, files, md, lang }) {
        return [
            { tag: 'h1', content: key },
            { content: md.map(file => ({
                content: file.content
            })) },
            menu(files.sort((a, b) => a.id > b.id).map(c => ({
                text: c.id,
                url: c.path,
            })))
        ];
    });

    function menu(items) {
        return {
            block: 'menu',
            mods: { mode: 'navigation', theme: 'islands', size: 'l' },
            mix: { elem: 'left-column' },
            content: items.map(item => ({
                elem: 'item',
                mods: { type: 'link' },
                content: {
                    block: 'link',
                    url: item.url,
                    content: item.text
                }
            }))
        }
    }
});
