const { Readable } = require('stream');
const crypto = require('crypto');

const miss = require('mississippi');
const nodeEval = require('node-eval');
const toArray = require('stream-to-array');
const fs = require('fs-extra');

const agrarium = require('@agrarium/core');
const Markdown = require('@agrarium/plugin-markdown');
const List = require('@agrarium/plugin-list');
const DTS = require('@agrarium/plugin-dts');

const filbtp = (filbtp) => miss.through.obj(function (data, _, cb) {
    (!filbtp || filbtp(data)) && this.push(data);
    cb();
});

module.exports = async function agrariumPresetBemReact({ blocks, pages, inlineExamples }) {
    const blocksList = new Set();
    const inlineExamplesStream = new Readable({ objectMode: true, read() {} });

    const pagesStream = agrarium({
        src: blocks.src,
        plugins: [
            new List({
                hook: chunk => blocksList.add(chunk.key)
            }),
            new Markdown({
                i18n: pages.i18n,
                format: 'html'
                // hook: ({ lang, content }) => {
                //     if (inlineExamples.langs.includes(lang)) {
                //         const id = hash(content);
                //         const source = nodeEval(`(${content})`);
                //         const wrappedContent = inlineExamples.wrapExample ?
                //             inlineExamples.wrapExample({ id, source }) :
                //             source;

                //         inlineExamplesStream.push({
                //             id,
                //             lang,
                //             name: id, // TODO: get it from shabang
                //             content: wrappedContent
                //         });

                //         return { src: `/${inlineExamples.publicPath}/${id}.html`.replace(/\/\//g, '/') };
                //     }
                // }
            }),
            new DTS()
        ]
    })
    .on('error', console.error)
    .on('end', () => inlineExamplesStream.push(null));

    const tranformedPagesStream = pagesStream
        .pipe(miss.through.obj(function(obj, _, cb) {
            try {
                this.push({
                    name: `${obj.chunk.key}`,
                    files: obj.chunk.files,
                    markdown: obj.chunk.data.markdown.map(markdown => ({
                        lang: markdown.lang,
                        content: markdown.content,
                        path: markdown.file.path
                    })),
                    dts: obj.chunk.data.dts
                });
                cb();
            } catch (e) {
                console.error(e);
                cb();
            }
        }))
        .on('error', console.error)

    // inlineExamplesStream
    //     .pipe(miss.through.obj(function(example, _, cb) {
    //         cb(null, new BemBundle({
    //             name: example.name,
    //             bemjson: example.content
    //         }));
    //     }))
    //     .on('error', console.error)
    //     .pipe(xjstBuilder({
    //         src: inlineExamples.src,
    //         output: inlineExamples.output
    //     }))
    //     .on('error', console.error);

    fs.outputJsonSync(pages.output, {
        pages: (await toArray(tranformedPagesStream)).reduce((pages, page) => {
            pages[page.name] = page;
            return pages;
        }, {}),
        blocks: Array.from(blocksList),
        i18n: pages.i18n
    }, {
        spaces: 2
    });
}

function hash(content) {
    const h = crypto.createHash('sha256');
    h.update(content);
    return h.digest('base64')
        .replace(/\+/g, '-')
        .replace(/\=/g, '')
        .replace(/\//g, '_');
}
