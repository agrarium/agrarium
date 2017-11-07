const { bemtree } = require('bem-xjst');
const miss = require('mississippi');

const BEMTREE = bemtree.compile(function() {
    block('root').def()((_, ctx) => [{
        block: 'page',
        title: 'Компонент ' + ctx.chunk.key,
        favicon: '//bem.info/favicon.ico',
        head: [
            {
                elem: 'css',
                url: ctx.chunk.key + '.css'
            },
            {
                elem: 'js',
                url: ctx.chunk.key + '.js'
            },
            {
                elem: 'meta',
                attrs: {
                    name: 'keywords',
                    content: 'Component ' + ctx.chunk.key
                }
            }
        ],
        content: [
            menu(ctx.context.components.sort((a, b) => a > b).map(c => ({
                text: c,
                url: c + '.html', // ctx.lib.generateRoute({ component })
            }))),
            applyCtx({ ...ctx, elem: 'content' })
        ]
    }]);

    block('root').elem('content').content()((_, ctx) => ([
        { tag: 'h1', content: ctx.chunk.key },
        menu(ctx.chunk.files.sort((a, b) => a.id > b.id).map(c => ({
            text: c.id,
            url: c.path,
        }))),
    ]));

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

module.exports = ({ chunk, context }, _, cb) => {
    try {
        return BEMTREE.apply({ block: 'root', chunk, context });
    } catch (e) {
        return { block: 'error', error: e };
    }
};
