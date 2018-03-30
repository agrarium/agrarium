/// <reference types="@types/agrarium" />
/// <reference types="@types/merge2" />

import { join } from 'path';
import { Readable } from 'stream';
import * as walk from '@bem/sdk.walk';
import { through } from 'mississippi';
import { StreamType } from 'merge2';

const toArray = require('stream-to-array');

const defaultGroupBy = (file: BEMSDK.IFile): string => file.entity.block;
const resolvePaths = (cwd: string, paths: string[]): string[] => paths.map(p => join(cwd, p));

export function agrarium(config: Agrarium.IConfig): StreamType {
    const { plugins = [], src, groupBy } = config;
    let { cwd } = config;
    const output = new Readable({ objectMode: true, read: () => {} });
    const context: Agrarium.IContext = Object.create(null);

    cwd = cwd || '';

    (async () => {
        let levels: string[];
        let walkerConfig: BEMSDK.IWalkConfig;

        // TODO: support new format [{ path: '', schema: '', naming: '' }]
        if (Array.isArray(src)) {
            levels = resolvePaths(cwd, src);
            walkerConfig = {
                levels: levels.reduce((acc: BEMSDK.ILevelsList, lvl: string) => {
                    acc[lvl] = { /* default settings */ };
                    return acc;
                }, {}),
                defaults: {
                    naming: undefined,
                },
            };
        } else {
            throw Error('Unsupported src type');
        }

        const intro: BEMSDK.IFile[] = await toArray(walk(levels, walkerConfig));

        type chunksDict = {
            [key: string]: BEMSDK.IFile[];
        };

        const groupped: chunksDict = intro.reduce((res: chunksDict, file: BEMSDK.IFile) => {
            const key = (groupBy || defaultGroupBy)(file);
            const capacitor = res[key] || (res[key] = []);
            capacitor.push(file);
            return res;
        }, {});

        const chunks: Agrarium.IComponent[] = Object.keys(groupped).map(key => ({
            config,
            key,
            files: groupped[key],
        }));

        for (const chunk of chunks) {
            await Promise.all(plugins.map(f => f.seed && f.seed(chunk, context)));
        }
        for (const chunk of chunks) {
            output.push(chunk);
        }
    })()
        .catch(err => output.emit('error', err))
        .then(() => output.push(null));

    return output
        .pipe(through.obj((
            chunk: Agrarium.IComponent,
            _: any,
            cb: (err: string | null, data?: Agrarium.IChunk) => void,
        ) => {
            (async () => {
                chunk.data = Object.create(null);
                const res = await Promise.all(
                    plugins.map(f => f.gather && f.gather(chunk, context)),
                );
                Object.assign.apply(
                    null,
                    ([] as Agrarium.IComponentDataPart).concat(chunk.data, res),
                );
                cb(null, { context, component: chunk });
            })().catch(cb);
        }));
}
