import * as path from 'path';
import * as typedocModule from 'typedoc';
import { IBemFile, IBemCell, IPlugin, IChunk } from '@agrarium/core';

export interface IParsedFile {
    reflection: INode;
    file: IBemFile;
}

export interface ISource {
    fileName: string;
    line: number;
    character: number;
    cell?: IBemCell;
}

export interface INode {
    kindString: string;
    name: string;
    type: {
        name: string;
        types?: {
            name: string;
        }[];
    };
    sources: ISource[];
    children?: INode[];
    comment?: {
        shortText: string;
        text: string;
    };
    signatures?: INode[];
    parameters?: INode[];
}

const allowedTech = new Set(['d.ts', 'ts', 'tsx']);

export class PluginTypeDoc implements IPlugin {
    private files: IBemFile[] = [];
    private parsed: any;

    seed(chunk: IChunk<IBemFile>) {
        const tsFiles = chunk.files.filter(f => allowedTech.has(f.tech));
        [].push.apply(this.files, tsFiles);
    }

    async gather(chunk: IChunk<IBemFile>) {
        const parsedFiles = await this.parseFiles();
        const typedoc = parsedFiles.filter((entity: IParsedFile) =>
            chunk.files.includes(entity.file));

        return { typedoc, key: chunk.key };
    }

    protected parseFiles() {
        return (this.parsed || (this.parsed = Promise.resolve(PluginTypeDoc.parse(this.files))));
    }

    private static parse(files: IBemFile[]) {
        const app = new typedocModule.Application({
            includeDeclarations: true,
            excludeExternals: true,
            module: 'commonjs',
            target: 'es6',
            jsx: 'react',
        });

        type filesDict = Record<string, IBemFile>;

        const filesByPath: filesDict = files.reduce((acc: filesDict, file) => {
            acc[path.resolve(file.path)] = file;
            return acc;
        }, {});

        const src = app.expandInputFiles(files.map(f => f.path));
        const projectReflection = app.convert(src);

        const ast = projectReflection.toObject();

        return ast.children.map((reflection: { originalName: string }) => ({
            reflection,
            file: filesByPath[reflection.originalName],
        }));
    }
}
