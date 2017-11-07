const { bemtree } = require('bem-xjst');
const miss = require('mississippi');

const BEMTREE = bemtree.compile(function() {
    block('root').def()(function(_, { key, files, components }) {

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
                { block: 'page', elem: 'content', files, key }
            ]
        });
    });

    block('page').elem('content').content()(function(_, { key, files }) {
        return [
            { tag: 'h1', content: key },
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

module.exports = class AgrariumBemjson {
    gather(chunk, context) {
        try {
            return { 
                bemjson: BEMTREE.apply({ 
                    block: 'root', 
                    key: chunk.key, 
                    files: chunk.files,
                    components: context.components
                }) 
            };
        } catch (error) {
            return { 
                bemjson: { 
                    block: 'error', 
                    content: error 
                }};
        }
    }
}
