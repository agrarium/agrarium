const nodeEval = require('node-eval');
const crypto = require('crypto');
const { join } = require('path');
const posthtml = require('posthtml');
const Plugin = require('@agrarium/plugin');

const hash = content => {
    const h = crypto.createHash('sha256');
    h.update(content);
    return h.digest('base64')
        .replace(/\+/g, '-')
        .replace(/\=/g, '')
        .replace(/\//g, '_');
};

const htmlentities = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"'
};

const replace = string => {
    return string.replace(/&(\w+|#\d+);/gi, (_, substring) => {
        const n = parseInt(substring.replace('#', ''));
        if (isNaN(n)) {
            return htmlentities[substring] || substring;
        } else {
            return String.fromCharCode(n);
        }
    });
};

module.exports = class AgrariumInlineExamples extends Plugin {
    constructor(options = {}) {
        super(...arguments);

        this.from = options.from;
    }

    async gather(chunk) {
        console.log('chunk', chunk);
        const { key, files, data } = chunk;
        const content = data[this.from];
        
        if(!content) {
            throw new Error(`Undeclared field '${this.from}' in chunk`);
        }

        const examples = [];

        posthtml([
            function(tree) {
                tree.match({ tag: 'code', mods: { lang: true } }, node => {
                    if (this.examples && this.langs.includes(node.mods.lang)) {
                        const content = node.content.join('');
                        const id = hash(content);
                        examples.push({
                            id,
                            name: id, // TODO: get it from shabang
                            lang: node.mods.lang,
                            source: nodeEval(replace(`(${content})`))
                        });

                        node.tag = 'iframe';
                        node.attrs = { src: `${this.publicPath}/${id}` };
                        node.content = null;
                    }

                    return node;
                });
        
                return tree;
            }
        ]).process(content, { skipParse: true, sync: true });

        return { 'inline-examples': examples };
    }
}
