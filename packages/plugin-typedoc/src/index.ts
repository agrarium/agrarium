/// <reference types="@agrarium/types" />

import * as path from 'path';
import * as typedocModule from 'typedoc';

export interface IParsedFile {
    reflection: INode;
    file: BEMSDK.IFile;
}

export interface ISource {
    fileName: string;
    line: number;
    character: number;
    cell?: BEMSDK.ICell;
}


// TODO: ОПИШИ РЕФЛЕКШОН БЛЕАТЬ!

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

export class PluginTypeDoc implements Agrarium.IPlugin {
    private files: BEMSDK.IFile[] = [];
    private parsed: any;

    public seed(component: Agrarium.IComponent): Agrarium.ISeedResult {
        const tsFiles = component.files.filter(f => allowedTech.has(f.tech));
        [].push.apply(this.files, tsFiles);
    }

    public async gather(component: Agrarium.IComponent): Promise<Agrarium.IComponentDataPart> {
        const parsedFiles = await this.parseFiles();
        const typedoc = parsedFiles.filter((entity: IParsedFile) =>
            component.files.includes(entity.file));

        return { typedoc, key: component.key };
    }

    protected parseFiles(): IParsedFile[] {
        return (this.parsed || (this.parsed = Promise.resolve(PluginTypeDoc.parse(this.files))));
    }

    private static parse(files: BEMSDK.IFile[]): IParsedFile[] {
        const app = new typedocModule.Application({
            includeDeclarations: true,
            excludeExternals: true,
            module: 'commonjs',
            target: 'es6',
            jsx: 'react',
        });

        type filesDict = {
            [key: string]: BEMSDK.IFile;
        };

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
