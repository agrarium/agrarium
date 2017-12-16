const PostMD = require('postmd');
const bemjson = require('postmd/plugins/postmd-bemjson');
const { join } = require('path');
const Plugin = require('@agrarium/plugin');

module.exports = class AgrariumMarkdown extends Plugin {
    constructor({ bemjson = false, format = 'json' }) {
        super(...arguments);

        this.bemjson = bemjson;
        this.format = format;
    }

    async gather({ key, files }) {
        const markdown = [];
        const grouped = {};
        const langs = new Set();

        for (let file of files.filter(f => f.tech.endsWith('md'))) {
            const lang = file.tech.replace(/\.?md/, '') || 'default';
            
            langs.add(lang);

            markdown.push({
                lang,
                file,
                content: PostMD(await this.readFile(file), {
                    transform: {
                        format: this.format,
                        plugins: [
                            this.bemjson && bemjson({ scope: this.bemjson.namespace })
                        ]
                    }
                })
            });
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
