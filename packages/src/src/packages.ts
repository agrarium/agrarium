import * as vfs from 'vinyl-fs';
import * as File from 'vinyl';
import { Transform } from 'stream';
import { basename } from 'path';

import { IStreamResolverOptions, Next } from '@agrarium/core';

const { through } = require('mississippi');

export interface IPackagesStreamOptions extends IStreamResolverOptions {
    pattern?: string;
}

export function packages(
    src: string,
    options?: IPackagesStreamOptions,
): Transform {
    const allFiles = options && options.pattern
        ? `${src}/${options.pattern}`
        : `${src}*/*`;

    const keys: Set<string> = new Set();
    const files: Map<string, File> = new Map();
    const groupedFiles: Record<string, File[]> = {};
    const packagesStream = new Transform({ objectMode: true, read: () => {} });

    vfs
        .src(allFiles, Object.assign({ read: false }, options))
        .pipe(through.obj(function(
            this: Transform,
            file: File,
            _: any,
            next: Next<File>,
        ) {
            file.stat && file.stat.isDirectory()
                ? keys.add(file.path)
                : (files.set(file.path, file), this.push(file));

            next();
        }))
        .on('data', (file: File) => {
            for (const key of keys) {
                if (!groupedFiles[key]) groupedFiles[key] = [];

                file.path.startsWith(key) && groupedFiles[key].push(file);
            }
        })
        .on('end', () => {
            for (const key in groupedFiles) {
                packagesStream.push({
                    options,
                    key: basename(key),
                    files: groupedFiles[key],
                });
            }

            packagesStream.push(null);
        });

    return packagesStream;
}
