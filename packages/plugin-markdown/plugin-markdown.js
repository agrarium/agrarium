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
    constructor({ i18n, bemjson = false, format = 'json', hook = () => {} }) {
        super(...arguments);

        this.bemjson = bemjson;
        this.format = format;
        this.hook = hook;
        this.langs = i18n.langs;
        this.defaultLang = i18n.default;
    }

    async gather({ key, files }) {
        const parsed = [];
        const grouped = {};
        const langs = new Set();

        for (let file of files.filter(f => f.tech.endsWith('md'))) {
            const lang = file.tech.replace(/\.?md/, '') || this.defaultLang;

            langs.add(lang);

            const content = PostMD(await this.readFile(file), {
                transform: {
                    format: 'json',
                    plugins: [
                        this.bemjson && bemjson({ scope: this.bemjson.namespace })
                    ].filter(Boolean)
                }
            });

             const tranformed = posthtml([
                this.hook && (tree => {
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
                })
            ].filter(Boolean)).process(content, { skipParse: true, sync: true });

            parsed.push({
                lang,
                file,
                content: this.format === 'html' ?
                    tranformed.html :
                    tranformed.tree
            });
        }

        const markdown = [];

        const addChunkByQuery = lang => query => {
            for (let chunk of parsed.filter(query)) {
                markdown.push({ ...chunk, lang });
            }
        }

        // add what we found on fs
        const emptyLangs = this.langs.filter(lang => {
            const inTheFiles = Array.from(langs).includes(lang);
            addChunkByQuery(lang)(chunk => chunk.lang === lang);
            return !inTheFiles;
        });

        // fill unfound with default
        for (let lang of emptyLangs) {
            // TODO: log warning for this langs, like a linter
            addChunkByQuery(lang)(chunk => chunk.lang === this.defaultLang);
        }

        return { markdown };
    }
}
