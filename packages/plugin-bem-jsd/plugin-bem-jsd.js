const Plugin = require('@agrarium/plugin');
const bemJsd = require('bem-jsd');

module.exports = class AgrariumBemJSD extends Plugin {
    async gather({ files }) {
        const bemjsd = [];

        for (let file of files.filter(f => f.tech.endsWith('js'))) {
            let jsd = bemJsd(await this.readFile(file));

            // 'bemjsd' returns { jsdocType: 'root' } for files without JSDoc
            if (Object.keys(jsd).length < 2) {
                jsd = {};
            }

            bemjsd.push({ file, jsd });
        }

        return { bemjsd };
    }
};
