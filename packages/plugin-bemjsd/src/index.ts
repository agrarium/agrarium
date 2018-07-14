import { IBemFile, IChunk } from '@agrarium/core';
import { Plugin, IWalkSources } from '@agrarium/plugin';

const bemJsd = require('bem-jsd');

export class PluginBemJSD extends Plugin {
    async gather(chunk: IChunk<IBemFile>) {
        const bemjsd: {
            jsd: any;
            file: IBemFile
        }[] = [];

        await this.walkSources({
            files: chunk.files,
            tech: 'js',
        }, (result: IWalkSources) => {
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
