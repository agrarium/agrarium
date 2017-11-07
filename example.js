const countryman = require('.');
const miss = require('mississippi');

const ComponentsCollector = require('./plugins/countryman-components-collector');
const JSDoc = require('./plugins/countryman-jsdoc');
const Bemjson = require('./plugins/countryman-bemjson');

const xjstBuilder = require('./builders/countryman-xjst');

countryman({
    src: [
        'node_modules/bem-components/common.blocks',
        'node_modules/bem-components/touch.blocks',
        'node_modules/bem-components/desktop.blocks',
        'node_modules/bem-components/design/common.blocks',
        'node_modules/bem-components/design/desktop.blocks'
    ],
    plugins: [
        new ComponentsCollector(/* settings */),
        new JSDoc(/* settings */),
        new Bemjson(/* settings */)
    ]
})
    .on('error', console.error)
    // .pipe(miss.through.obj(function (data, _, cb) {
    //     if (process.env.FILTER) {
    //         process.env.FILTER === data.chunk.key && this.push(data);
    //         cb();
    //         return;
    //     };
    //     cb(null, data);
    // }))
    // .on('data', ({ chunk, context, result }) => console.log(chunk.key, chunk.data, Object.assign({}, context, {components: undefined})))
    // .on('data', console.log)
    .pipe(xjstBuilder({
        levels: {
            'node_modules/bem-core/common.blocks': {},
            'node_modules/bem-core/desktop.blocks': {},
            'node_modules/bem-components/common.blocks': {},
            'node_modules/bem-components/desktop.blocks': {},
            'node_modules/bem-components/design/common.blocks': {},
            'node_modules/bem-components/design/desktop.blocks': {},
        },
        output: './out'
    }))
    .on('error', console.error);
