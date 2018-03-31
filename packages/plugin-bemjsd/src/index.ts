/// <reference types="@agrarium/types" />

import { Plugin } from '@agrarium/plugin';

// FIXME: Old style modules, the are not support ES modules
const bemJsd = require('bem-jsd');

export class PluginBemJSD extends Plugin {
    async gather(component: Agrarium.IComponent) {
        const bemjsd: {
            jsd: any;
            file: BEMSDK.IFile
        }[] = [];

        await this.walkSources({
            files: component.files,
            tech: 'js',
        }, (result: Agrarium.IWalkSourcesResult) => {
            let jsd = bemJsd(result.source);

            // 'bemjsd' returns { jsdocType: 'root' } for files without JSDoc
            if (Object.keys(jsd).length < 2) {
                jsd = {};
            }

            bemjsd.push({ jsd, file: result.file });
        });

        return { bemjsd };
    }
}
