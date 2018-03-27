import { join } from 'path';

import { Command, flags } from '@oclif/command';
import * as mergeStreams from 'merge2';
import { through } from 'mississippi';
import { ThroughStream } from 'through';
import * as streamToArray from 'stream-to-array';
import { outputFile } from 'fs-extra';

import * as agrarium from '@agrarium/core';
import * as Plugin from '@agrarium/plugin';

const DEFAULT_CONFIG_PATH = '.agrarium.js';

type Noop = () => void;

interface IAgrariumConfig {
    src: string[];
    plugins: Plugin[]|Plugin[][];
    transform?: (chunk: IAgrariumChunk) => {};
    cwd?: string;
}

interface IBemEntity {
    cell: {
        entity: {
            block: string;
            elem?: string;
            mod?: {
                name: string;
                val: string|boolean
            }
        };
    };
    path: string;
    level: string;
}

interface IAgrariumChunk {
    component: {
        key: string;
        files: IBemEntity[]
        data: {
            [key: string]: any;
        };
        config: IAgrariumConfig;
    };
    context: {
        [key: string]: any;
    };
}

const examples = [`
❯ agrarium harvest
❯ agrarium harvest -o output.txt
❯ agrarium harvest -j -o path/to/harvest.json
❯ agrarium harvest --exec path/to/worker.js
❯ agrarium harvest -c ../.agrarium.js -c path/to/one/more/.agrarium.js
❯ agrarium harvest -j | xargs echo > ./file.json
❯ agrarium harvest | builder
`];

const flatten = (arrays: any[] | any[][]): any[] => [].concat.apply([], arrays);
const unique = (plugins: Plugin[]): Plugin[] => {
    const dict = {} as {
        [key: string]: Plugin;
    };
    plugins.forEach((plugin) => {
        dict[typeof plugin] = plugin;
    });

    return Object.keys(dict).map(key => dict[key]);
};

type Transformer = (stream: ThroughStream, chunk: IAgrariumChunk, next: Noop) => void;
const transform = (trnsfrmr: Transformer) =>
    through.obj(function(
        this: ThroughStream,
        chunk: IAgrariumChunk,
        _: any,
        next: Noop,
    ) {
        trnsfrmr(this, chunk, next);
    });

export default class Harvest extends Command {
    static description = 'Combine all data together ;-)';

    static examples = examples;

    static flags = {
        // boolean flag (-j, --json)
        json: flags.boolean({
            char: 'j',
            description: 'Export data as JSON',
        }),
        // flag with a value (-o, --output=path/to/harvest.json)
        output: flags.string({
            char: 'o',
            description: 'Path to output file with harvested data',
        }),
        // flag with a value (-e, --exec=path/to/handler.js)
        exec: flags.string({
            char: 'e',
            description: 'Path to chunk handler',
        }),
        // flag with a values (-c, --config=path/to/.agrarium.js)
        config: flags.string({
            char: 'c',
            description: 'Path to Agrarium config',
            multiple: true,
        }),
        // flag with a value (-d, --workdir=path/to/cwd)
        workdir: flags.string({
            char: 'd',
            description: 'Working directory',
        }),
        // boolean flag (-s, --silent)
        silent: flags.boolean({
            char: 's',
            description: 'No info to stdout',
        }),
    };

    private cwd: string = process.cwd();

    async run() {
        const { flags } = this.parse(Harvest);
        const { json, output, exec, workdir, silent } = flags;

        this.cwd = workdir || this.cwd;

        const config: string[] = flags.config || [DEFAULT_CONFIG_PATH];

        let dataStream = mergeStreams(
            ...this.runResolvedConfigs(config),
        ).pipe(transform((stream: ThroughStream, chunk: IAgrariumChunk, next: Noop) => {
            if (chunk.component.config.transform) {
                stream.push(chunk.component.config.transform(chunk));
            } else {
                stream.push(chunk);
            }
            next();
        }));

        if (exec) {
            const worker = require(join(this.cwd, exec));
            dataStream.pipe(transform((
                stream: ThroughStream,
                chunk: IAgrariumChunk,
                next: Noop,
            ) => {
                worker(chunk);
                next();
            }));
        }

        if (json && output) {
            const dataArray = await streamToArray(dataStream);
            return await outputFile(join(this.cwd, output), JSON.stringify(dataArray, null, 2));
        }

        dataStream = dataStream.pipe(transform((
            stream: ThroughStream,
            chunk: IAgrariumChunk,
            next: Noop,
        ) => {
            stream.push(JSON.stringify(chunk) + '\n');
            next();
        }));

        if (output) {
            const dataArray = await streamToArray(dataStream);
            return await outputFile(join(this.cwd, output), dataArray.join());
        }

        if (!silent) {
            dataStream.pipe(process.stdout);
        }
    }

    private runResolvedConfigs(paths: string[]): mergeStreams.StreamType[] {
        return flatten(paths).map((configPath: string) => {
            const reolvedPath = join(this.cwd, configPath);
            const resolved: IAgrariumConfig = require(reolvedPath);
            return agrarium({
                ...resolved,
                plugins: unique(flatten(resolved.plugins)),
                cwd: this.cwd,
            });
        });
    }
}
