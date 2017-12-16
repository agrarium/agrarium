const miss = require('mississippi');
const { Readable } = require('stream');
const agrarium = require('@agrarium/core');
const ComponentsCollector = require('@agrarium/plugin-components-collector');
const Markdown = require('@agrarium/plugin-markdown');
const InlineExamples = require('@agrarium/plugin-inline-examples');
const xjstBuilder = require('@agrarium/builder-xjst');

const examplesFlow = new Readable({ objectMode: true, read() {} });

agrarium({
    src: [
        'node_modules/bem-components/common.blocks',
        'node_modules/bem-components/touch.blocks',
        'node_modules/bem-components/desktop.blocks',
        'node_modules/bem-components/design/common.blocks',
        'node_modules/bem-components/design/desktop.blocks'
    ],
    plugins: [
        new ComponentsCollector(),
        new Markdown({
            format: 'json',
            bemjson: {
                namespace: 'markdown'
            }
        }),
        new InlineExamples({
            from: 'markdown',
            publicPath: '/',
            langs: ['js', 'bemjson']
        })
    ]
})
    // .on('error', console.error)
    // .pipe(miss.through.obj(function (data, _, cb) {
    //     if(ex) {
    //         examplesFlow.push(data.chuck);
    //     }
    // }, function() { // destroy
    //     examplesFlow.push(null);
    // }))
    // .pipe(miss.through.obj(function (data, _, cb) {
    //     if (process.env.FILTER) {
    //         process.env.FILTER === data.chunk.key && this.push(data);
    //         cb();
    //         return;
    //     };
    //     cb(null, data);
    // }))
    // .on('data', ({ chunk, context, result }) => console.log(chunk.key, chunk.data, Object.assign({}, context, {components: undefined})))
    .on('data', ({ chunk }) => console.log(chunk.data.markdown))
    // examplesFlow
    // .pipe(xjstBuilder({
    //     levels: {
    //         'node_modules/bem-core/common.blocks': {},
    //         'node_modules/bem-core/desktop.blocks': {},
    //         'node_modules/bem-components/common.blocks': {},
    //         'node_modules/bem-components/desktop.blocks': {},
    //         'node_modules/bem-components/design/common.blocks': {},
    //         'node_modules/bem-components/design/desktop.blocks': {},
    //     },
    //     i18n: {
    //         default: 'en',
    //         langs: ['ru', 'en', 'uk']
    //     },
    //     // buildOptions,
    //     // levels: ['blocks', 'name.blocks']
    //     output: './out'
    // }))
    // .on('error', console.error);
