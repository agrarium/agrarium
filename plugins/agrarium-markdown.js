const toBemjson = require('md-to-bemjson').convert;
const Plugin = require('../lib/Plugin');

module.exports = class AgrariumMarkdown extends Plugin {
    async gather({ key, files }) {
        const md = [];
        const grouped = {};
        const langs = new Set();

        for (let file of files.filter(f => f.tech.endsWith('md'))) {
            const lang = file.tech.replace(/\.?md/, '') || 'default';
            
            langs.add(lang);

            md.push({
                lang,
                file,
                content: await toBemjson(await this.readFile(file))
            });
        }

        langs.delete('default');

        for(let lang of langs) {
            grouped[lang] = [];
            for(let chunk of md.filter(chunk => chunk.lang === lang || chunk.lang === 'default')) {
                grouped[lang].push(chunk);
            }
        }

        return { md: grouped };
    }
}
