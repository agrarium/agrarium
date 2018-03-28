/// <reference types="@types/agrarium" />

import { readFile } from 'fs';
import { promisify } from 'util';

const read = promisify(readFile);

export class Plugin implements Agrarium.IPlugin {

    constructor(options?: { [key: string]: any }) {}

    private static files: Map<string, Agrarium.fileSource> = new Map();

    public async readFile(options: { path: string }): Promise<Agrarium.fileSource> {
        Plugin.files.has(options.path) ||
        Plugin.files.set(options.path, await read(options.path, 'utf-8'));

        return Plugin.files.get(options.path);
    }

    public async walkSources(
        options: { tech: string, files: Agrarium.IBemEntity[]},
        cb: (result: Agrarium.IWalkSourcesResult) => void,
    ): Promise<void> {
        for (const file of options.files.filter(f => f.tech.endsWith(options.tech))) {
            const source = await this.readFile(file);

            cb({ source, file });
        }
    }
}
