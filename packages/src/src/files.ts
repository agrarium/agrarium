import * as vfs from 'vinyl-fs';
import { Transform } from 'stream';
import * as Vinyl from 'vinyl';
import { basename, extname, relative, dirname } from 'path';

import { IStreamResolverOptions, Next } from '@agrarium/core';

const { through } = require('mississippi');

export function files(
    src: string,
    options?: IStreamResolverOptions,
): Transform {
    const cwd = relative(process.cwd(), src.split('/*')[0]);

    return vfs
    .src(src, Object.assign({ read: false }, options))
    .pipe(through.obj(function(
        this: Transform,
        chunk: Vinyl,
        _: any,
        next: Next<Vinyl>,
    ) {
        const { path } = chunk;
        const tech = extname(path);
        const base = path.split(cwd)[1];

        if (options && options.read) {
            chunk._contents = String(chunk.contents);
        }

        this.push({
            options,
            base: dirname(base).replace('/', ''),
            key: basename(path, tech),
            files: [chunk],
        });

        next();
    }));
}
