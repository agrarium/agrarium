const PostMD = require('postmd');
const bemjson = require('postmd/plugins/postmd-bemjson');
const nodeEval = require('node-eval');
const crypto = require('crypto');
const { join } = require('path');

const Plugin = require('../lib/Plugin');

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

module.exports = class AgrariumMarkdown extends Plugin {
    constructor({ inlineExamplesLangs = [], inlineExamplesPublicPath = '/' }) {
        super(...arguments);

        this.inlineExamplesLangs = inlineExamplesLangs;    
        this.inlineExamplesPublicPath = inlineExamplesPublicPath;    
    }

    async gather({ key, files }) {
        const md = [];
        const grouped = {};
        const examples = [];
        const langs = new Set();

        for (let file of files.filter(f => f.tech.endsWith('md'))) {
            const lang = file.tech.replace(/\.?md/, '') || 'default';
            
            langs.add(lang);

            md.push({
                lang,
                file,
                content: PostMD(await this.readFile(file), {
                    transform: {
                        format: 'json',
                        plugins: [
                            bemjson({ scope: 'md' }),
                            tree => {
                                tree.match({ tag: 'code', mods: { lang: true } }, node => {
                                    if (this.inlineExamplesLangs.includes(node.mods.lang)) {
                                        const content = node.content.join('');
                                        const id = hash(content);
                                        examples.push({
                                            id,
                                            name: id, // TODO: get it from shabang
                                            lang: node.mods.lang,
                                            source: nodeEval(replace(`(${content})`))
                                        });

                                        node.tag = 'iframe';
                                        node.attrs = { src: `${this.inlineExamplesPublicPath}/${id}` };
                                        node.content = null;
                                    }

                                    return node;
                                });
                            
                                return tree;
                            }
                        ]
                    }
                })
            });
        }

        langs.delete('default');

        for (let lang of langs) {
            grouped[lang] = [];
            for (let chunk of md.filter(chunk => chunk.lang === lang || chunk.lang === 'default')) {
                grouped[lang].push(chunk);
            }
        }

        return { md: grouped, examples };
    }
}
