import { Transform } from 'stream';

import { IStreamResolverOptions, IBemFile } from '@agrarium/core';

const walk = require('@bem/sdk.walk');

export interface IComponentsStreamOptions extends IStreamResolverOptions {
    naming: 'react' | 'origin' | 'two-dashes';
    schema?: 'nested' | 'flat' | 'mixed';
    pattern?: string;
    groupBy?: (file: IBemFile) => string;
}

const defaultGroupByComponent = (file: IBemFile): string => file.entity.block;

export function components(
    levels: string | string[],
    options: IComponentsStreamOptions,
): Transform {
    const walkConfig = {
        naming: {
            preset: options.naming,
            fs: {
                scheme: options.schema,
            },
        },
    };
    const files: IBemFile[] = [];
    const componentsStream = new Transform({ objectMode: true });
    const normalizedLevels = ([] as string[]).concat(levels);

    walk(normalizedLevels, {
        levels: normalizedLevels.reduce((acc, lvl) => {
            acc[lvl] = walkConfig;
            return acc;
        }, {} as Record<string, object>),
    })
        .on('data', (file: IBemFile) => files.push(file))
        .on('end', () => {
            const groupedFiles = files.reduce((res, file) => {
                const key = (options.groupBy || defaultGroupByComponent)(file);
                const capacitor = res[key] || (res[key] = []);
                capacitor.push(file);
                return res;
            }, {} as Record<string, IBemFile[]>);

            for (const key in groupedFiles) {
                componentsStream.push({
                    key,
                    options,
                    files: groupedFiles[key],
                });
            }
        });

    return componentsStream;
}
