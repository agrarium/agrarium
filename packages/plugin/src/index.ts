import { readFile } from 'fs';
import { promisify } from 'util';

import { IBemFile } from '@agrarium/core';

const read = promisify(readFile);

export interface IWalkSources {
    source: string | undefined;
    file: IBemFile;
}

export class Plugin {
    protected static files: Map<string, string> = new Map();

    async readFile(options: { path: string }): Promise<string | undefined> {
        Plugin.files.has(options.path) ||
        Plugin.files.set(options.path, await read(options.path, 'utf-8'));

        return Plugin.files.get(options.path);
    }

    async walkSources(
        options: { tech: string, files: IBemFile[]},
        cb: (result: IWalkSources) => void,
    ): Promise<void> {
        for (const file of options.files.filter(f => f.tech.endsWith(options.tech))) {
            const source = await this.readFile(file);

            cb({ source, file });
        }
    }
}
