/// <reference types="@agrarium/types" />

import { join } from 'path';

import { Command, flags } from '@oclif/command';
import * as mergeStreams from 'merge2';
import { ThroughStream } from 'through';
import { outputFile } from 'fs-extra';

import { agrarium } from '@agrarium/core';

// FIXME: Old style modules, the are not support ES modules
const streamToArray = require('stream-to-array');
const { through } = require('mississippi');

const DEFAULT_CONFIG_PATH = '.agrarium.js';

type Noop = () => void;

const examples = [`
❯ agrarium harvest
❯ agrarium harvest -o output.txt
❯ agrarium harvest -j -o path/to/harvest.json
❯ agrarium harvest --concurenty path/to/worker.js
❯ agrarium harvest --flush path/to/worker.js
❯ agrarium harvest -c ../.agrarium.js -c path/to/one/more/.agrarium.js
❯ agrarium harvest -j | xargs echo > ./file.json
❯ agrarium harvest | builder
`];

const flatten = (arrays: any[] | any[][]): any[] => [].concat.apply([], arrays);
const unique = (plugins: Agrarium.IPlugin[]): Agrarium.IPlugin[] => {
    const dict = {} as {
        [key: string]: Agrarium.IPlugin;
    };
    plugins.forEach((plugin) => {
        dict[typeof plugin] = plugin;
    });

    return Object.keys(dict).map(key => dict[key]);
};

type Transformer = (stream: ThroughStream, chunk: Agrarium.IChunk, next: Noop) => void;
const transform = (trnsfrmr: Transformer) =>
    through.obj(function(
        this: ThroughStream,
        chunk: Agrarium.IChunk,
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
        // flag with a value (--concurently=path/to/worker.js)
        concurently: flags.string({
            description: 'Path to chunk worker',
        }),
        // flag with a value (--flush=path/to/transformer.js)
        flush: flags.string({
            description: 'Path to result transformer',
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
        // boolean flag (--watch)
        // TODO: implement it
        watch: flags.boolean({
            description: 'Restart on changes',
        }),
    };

    private cwd: string = process.cwd();

    async run() {
        const { flags } = this.parse(Harvest);
        const { json, output, concurently, flush, workdir, silent } = flags;

        this.cwd = workdir || this.cwd;

        const config: string[] = flags.config || [DEFAULT_CONFIG_PATH];

        const dataStream = mergeStreams(
            ...this.runResolvedConfigs(config),
        ).pipe(transform(async (stream: ThroughStream, chunk: Agrarium.IChunk, next: Noop) => {
            chunk.component.config.transform ?
                stream.push(await chunk.component.config.transform(chunk)) :
                stream.push(chunk);
            next();
        }));

        if (concurently) {
            const worker = require(join(this.cwd, concurently));
            dataStream.pipe(transform((
                stream: ThroughStream,
                chunk: Agrarium.IChunk,
                next: Noop,
            ) => {
                worker(chunk);
                next();
            }));
        }

        const stringifiedStream = json ? dataStream : dataStream.pipe(transform((
            stream: ThroughStream,
            chunk: Agrarium.IChunk,
            next: Noop,
        ) => {
            stream.push(JSON.stringify(chunk));
            stream.push('\n');
            next();
        }));

        if (output) {
            const data = await streamToArray(stringifiedStream);
            let result = data;

            if (flush) {
                const flusher = require(join(this.cwd, flush));
                result = await flusher(data);
            }

            result = json ? JSON.stringify(result, null, 2) : result.join('');

            return outputFile(join(this.cwd, output), result);
        }

        if (!silent) {
            stringifiedStream.pipe(process.stdout);
        }
    }

    private runResolvedConfigs(paths: string[]): mergeStreams.StreamType[] {
        return flatten(paths).map((configPath: string) => {
            const reolvedPath = join(this.cwd, configPath);
            const resolved: Agrarium.IConfig = require(reolvedPath);
            return agrarium({
                ...resolved,
                plugins: unique(flatten(resolved.plugins)),
                cwd: this.cwd,
            });
        });
    }
}
