const { Readable } = require('stream');
const crypto = require('crypto');
const miss = require('mississippi');
const nodeEval = require('node-eval');
const BemBundle = require('@bem/sdk.bundle');
const agrarium = require('@agrarium/core');
const Markdown = require('@agrarium/plugin-markdown');
const List = require('@agrarium/plugin-list');
const xjstBuilder = require('@agrarium/builder-xjst');

module.exports = function agrariumPresetBem({ blocks, pages, inlineExamples }) {
    const blocksList = new Set();
    const inlineExamplesStream = new Readable({ objectMode: true, read() {} });

    function makeBemjson({ chunk, context, lang, i18n }) {
        try {
            return pages.templates.apply({ 
                block: 'root', 
                key: chunk.key, 
                files: chunk.files,
                lang,
                md: chunk.data.md[lang] || chunk.data.md[i18n.default],
                ...context
            });
        } catch (error) {
            return { 
                block: 'error', 
                content: error 
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
                format: 'json',
                bemjson: {
                    namespace: 'markdown'
                },
                hook: ({ lang, content }) => {
                    if (inlineExamples.langs.includes(lang)) {
                        const id = hash(content);
                        inlineExamplesStream.push({
                            id,
                            lang,
                            name: id, // TODO: get it from shabang
                            content: nodeEval(`(${content})`)
                        });
                        
                        return { src: `/${inlineExamples.publicPath}/${id}` };
                    }
                }
            })
        ]
    }).on('end', () => inlineExamplesStream.push(null));
    
    pagesStream
        /**
         * Stream<> → (Stream<BemBundle>)
         */
        .pipe(miss.through.obj(function(obj, _, cb) {
            try {
                for(let lang of pages.i18n.langs) { 
                    this.push(new BemBundle({
                        name: `${obj.chunk.key}.${lang}`,
                        bemjson: makeBemjson({ 
                            chunk: obj.chunk, 
                            context: {
                                agrarium: obj.context,
                                blocks: blocksList
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
        .pipe(xjstBuilder({
            src: pages.src,
            i18n: pages.i18n,
            output: pages.output
        }));
    
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
        .pipe(xjstBuilder({
            src: inlineExamples.src,
            output: inlineExamples.output
        }));    
}

function hash(content) {
    const h = crypto.createHash('sha256');
    h.update(content);
    return h.digest('base64')
        .replace(/\+/g, '-')
        .replace(/\=/g, '')
        .replace(/\//g, '_');
}


    // .pipe(miss.through.obj(function (data, _, cb) {
    //     if (process.env.FILTER) {
    //         process.env.FILTER === data.chunk.key && this.push(data);
    //         cb();
    //         return;
    //     };
    //     cb(null, data);
    // }))
    // .on('data', ({ chunk, context, result }) => console.log(chunk.key, chunk.data, Object.assign({}, context, {components: undefined})))
    // .on('data', ({ chunk }) => console.log(chunk.data.markdown))
    // examplesFlow
    
    // .on('error', console.error);
    // .on('end', () => console.log(blocks));

// examples.on('data', console.log);
