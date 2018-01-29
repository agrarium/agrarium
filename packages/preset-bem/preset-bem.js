const { Readable } = require('stream');
const crypto = require('crypto');

const miss = require('mississippi');
const nodeEval = require('node-eval');
const BemBundle = require('@bem/sdk.bundle');

const agrarium = require('@agrarium/core');
const Markdown = require('@agrarium/plugin-markdown');
const List = require('@agrarium/plugin-list');
const xjstBuilder = require('@agrarium/builder-xjst');

const filbtp = (filbtp) => miss.through.obj(function (data, _, cb) {
    (!filbtp || filbtp(data)) && this.push(data);
    cb();
});

module.exports = function agrariumPresetBem({ blocks, pages, inlineExamples }) {
    const blocksList = new Set();
    const inlineExamplesStream = new Readable({ objectMode: true, read() {} });

    function makeBemjson({ agrarium, lang, i18n }) {
        try {
            return pages.templates.apply({
                block: 'root',
                agrarium,
                lang,
                i18n
            });
        } catch (error) {
            return {
                block: 'error',
                content: String(Object(error).stack || error)
            };
        }
    }

    const pagesStream = agrarium({
        src: blocks.src,
        plugins: [
            new List({
                hook: chunk => blocksList.add(chunk.key)
            }),
            new Markdown({
                i18n: pages.i18n,
                format: 'json',
                bemjson: {
                    namespace: 'markdown'
                },
                hook: ({ lang, content }) => {
                    if (inlineExamples.langs.includes(lang)) {
                        const id = hash(content);
                        const source = nodeEval(`(${content})`);
                        const wrappedContent = inlineExamples.wrapExample ?
                            inlineExamples.wrapExample({ id, source }) :
                            {
                                block: 'page',
                                head: [
                                    { elem: 'css', url: `${id}.css` },
                                    { elem: 'js', url: `${id}.js` }
                                ],
                                content: source
                            };

                        inlineExamplesStream.push({
                            id,
                            lang,
                            name: id, // TODO: get it from shabang
                            content: wrappedContent
                        });

                        return { src: `/${inlineExamples.publicPath}/${id}.html`.replace(/\/\//g, '/') };
                    }
                }
            })
        ]
    })
        .on('error', console.error).on('end', () => inlineExamplesStream.push(null));

    pagesStream
        /**
         * Stream<> → (Stream<BemBundle>)
         */
        .pipe(miss.through.obj(function(obj, _, cb) {
            try {
                for(let lang of pages.i18n.langs) {
                    this.push(new BemBundle({
                        name: `${obj.chunk.key}.${lang}`,
                        bemjson: xxx = makeBemjson({
                            agrarium: {
                                // mined chunk
                                chunk: obj.chunk,
                                // all plugins data
                                data: {
                                    ...obj.chunk.data,
                                    list: {
                                        blocks: Array.from(blocksList)
                                    }
                                }
                            },
                            i18n: pages.i18n,
                            lang
                        })
                    }));
                }
                cb();
            } catch (e) {
                console.error(e);
                cb();
            }
        }))
        .on('error', console.error)
        // .pipe(filbtp(bundle => !/icon/.test(bundle.name)))
        .pipe(xjstBuilder({
            src: pages.src,
            i18n: pages.i18n,
            output: pages.output
        }))
        .on('error', console.error);
        // .on('data', chunk => { if (!/\.js$/.test(chunk.path)) { console.log(chunk), process.exit(1) } });

    inlineExamplesStream
        /**
         * Stream<> → (Stream<BemBundle>)
         */
        .pipe(miss.through.obj(function(example, _, cb) {
            cb(null, new BemBundle({
                name: example.name,
                bemjson: example.content
            }));
        }))
        .on('error', console.error)
        .pipe(xjstBuilder({
            src: inlineExamples.src,
            output: inlineExamples.output
        }))
        .on('error', console.error);
}

function hash(content) {
    const h = crypto.createHash('sha256');
    h.update(content);
    return h.digest('base64')
        .replace(/\+/g, '-')
        .replace(/\=/g, '')
        .replace(/\//g, '_');
}

    // .on('data', ({ chunk, context, result }) => console.log(chunk.key, chunk.data, Object.assign({}, context, {components: undefined})))
    // .on('data', ({ chunk }) => console.log(chunk.data.markdown))
    // examplesFlow

    // .on('error', console.error);
    // .on('end', () => console.log(blocks));

// examples.on('data', console.log);
