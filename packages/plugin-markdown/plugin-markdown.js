const PostMD = require('postmd');
const bemjson = require('postmd/plugins/postmd-bemjson');
const { join } = require('path');
const posthtml = require('posthtml');
const Plugin = require('@agrarium/plugin');

const htmlEntities = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"'
};

const decodeHtmlEntities = string => {
    return string.replace(/&(\w+|#\d+);/gi, (_, substring) => {
        const n = parseInt(substring.replace('#', ''));
        if (isNaN(n)) {
            return htmlEntities[substring] || substring;
        } else {
            return String.fromCharCode(n);
        }
    });
};

module.exports = class AgrariumMarkdown extends Plugin {
    constructor({ bemjson = false, format = 'json', hook = () => {} }) {
        super(...arguments);

        this.bemjson = bemjson;
        this.format = format;
        this.hook = hook;
    }

    async gather({ key, files }) {
        const markdown = [];
        const grouped = {};
        const langs = new Set();

        for (let file of files.filter(f => f.tech.endsWith('md'))) {
            const lang = file.tech.replace(/\.?md/, '') || 'default';
            
            langs.add(lang);

            const content = PostMD(await this.readFile(file), {
                transform: {
                    format: this.format,
                    plugins: [
                        this.bemjson && bemjson({ scope: this.bemjson.namespace })
                    ]
                }
            });

            posthtml([
                tree => {
                    tree.match({ tag: 'code', attrs: { class: true } }, node => {
                        const content = decodeHtmlEntities(node.content.join(''));
                        const sourceLang = node.attrs.class.replace('lang-', '');
                        const changedContent = this.hook({ lang: sourceLang, content });

                        if(changedContent) {
                            node.tag = 'iframe';
                            node.attrs = { src: changedContent.src };
                            node.content = null;
                        }
    
                        return node;
                    });
            
                    return tree;
                }
            ]).process(content, { skipParse: true, sync: true });

            markdown.push({ lang, file, content });
        }

        langs.delete('default');

        const result = [];
        for (let lang of langs) {
            for (let chunk of markdown.filter(chunk => chunk.lang === lang || chunk.lang === 'default')) {
                result.push(chunk);
            }
        }

        return { markdown: result };
    }
}
