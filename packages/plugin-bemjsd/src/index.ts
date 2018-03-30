/// <reference types="@types/agrarium" />

import { Plugin } from '@agrarium/plugin';
import * as bemJsd from 'bem-jsd';

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
