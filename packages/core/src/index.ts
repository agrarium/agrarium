import * as Vinyl from 'vinyl';
import { Transform } from 'stream';
import { join } from 'path';

import { Next, IChunk, IPlugin } from '../typings';

const { through } = require('mississippi');

export function json(): Transform {
    return through.obj(function(
        this: Transform,
        chunk: any,
        _: any,
        next: Next<any>,
    ) {
        this.push(new Vinyl({
            cwd: process.cwd(),
            path: join(chunk.base || '', `${chunk.key}.json`),
            contents: new Buffer(JSON.stringify(chunk, null, 2)),
        }));

        next();
    });
}

export function plugins(plugins: IPlugin[]): Transform {
    const context: Record<string, any> = Object.create(null);

    const chunks: IChunk[] = [];

    return through.obj(function(
        this: Transform,
        chunk: IChunk,
        _: any,
        next: Next<IChunk>,
    ) {
        chunk.context = context;

        Promise
            .all(plugins.map(p => p.seed && p.seed(chunk, context)))
            .then(() => {
                chunks.push(chunk);
                next();
            })
            .catch(next);
    }, function(
        this: Transform,
        next: Next<IChunk>,
    ) {
        const promises = chunks.map(async (chunk) => {
            chunk.data = Object.create(null);
            const res = await Promise
                .all(plugins.map(f => f.gather && f.gather(chunk, context)));
            Object.assign.apply(null, ([] as Record<string, any>).concat(chunk.data, res));
            this.push(chunk);
        });

        Promise.all(promises).then(() => next()).catch(next);
    });
}

export *  from '../typings';
