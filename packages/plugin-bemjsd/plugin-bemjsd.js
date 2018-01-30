const Plugin = require('@agrarium/plugin');
const bemJsd = require('bem-jsd');

module.exports = class AgrariumBemJSD extends Plugin {
    async gather({ files }) {
        const bemjsd = [];

        await this.walkSources({ tech: 'js', files }, ({ source, file }) => {
            let jsd = bemJsd(source);

            // 'bemjsd' returns { jsdocType: 'root' } for files without JSDoc
            if (Object.keys(jsd).length < 2) {
                jsd = {};
            }

            bemjsd.push({ file, jsd });
        });

        return { bemjsd };
    }
};
