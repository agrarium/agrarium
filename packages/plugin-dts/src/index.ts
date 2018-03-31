/// <reference types="@agrarium/types" />

import * as path from 'path';
import * as typedocModule from 'typedoc';

export interface IParsedFile {
    reflection: INode;
    file: BEMSDK.IFile;
}

interface OutputFormat {
    name: string;
    sources: string[];
    description: string;
    attributes: any[];
    methods: IMethod[];
}

interface IMethod {
    name: string;
    description?: string;
    type?: string;
    params?: IMethodParam[];
}

interface IMethodParam {
    name: string;
    description?: string;
    type?: string;
}

interface IResovedType {
    name: string;
}

export interface ISource {
    fileName: string;
    line: number;
    character: number;
    cell?: BEMSDK.ICell;
}

interface IProperty {
    name: string;
    description?: string;
    type?: string;
    sources?: ISource[];
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

type IHackyShitContext = Context | IMethod; // FIXME: tricky shit to pass Method as Context

export class PluginDTS implements Agrarium.IPlugin {
    private files: BEMSDK.IFile[] = [];
    private parsed: any;

    public seed(component: Agrarium.IComponent): Agrarium.ISeedResult {
        const dtsFiles = component.files.filter(f => f.tech === 'd.ts');
        [].push.apply(this.files, dtsFiles);
    }

    public async gather(component: Agrarium.IComponent): Promise<Agrarium.IComponentDataPart> {
        const parsedFiles = await this.getParsedFiles(this.files);
        const dts = parsedFiles.filter((entity: IParsedFile) =>
            component.files.includes(entity.file));

        return { key: component.key, dts: convert(dts) };
    }

    protected getParsedFiles(files: BEMSDK.IFile[]): IParsedFile[] {
        return (this.parsed || (this.parsed = new Promise(resolve => resolve(parse(files)))));
    }
}

function parse(files: BEMSDK.IFile[]): IParsedFile[] {
    const app = new typedocModule.Application({
        includeDeclarations: true,
        excludeExternals: true,
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

class Context {
    private file: BEMSDK.IFile;
    private data: OutputFormat;

    constructor(file: BEMSDK.IFile) {
        this.file = file;
        this.data = {
            name: '',
            sources: [],
            description: '',
            attributes: [],
            methods: [],
        };
    }
    get result() {
        return this.data;
    }
    setName(name: string) {
        this.data.name = name;
    }
    setDescription(text: string) {
        this.data.description = text;
    }
    addSource(sources: ISource[]) {
        [].push.apply(this.data.sources, sources.map((source) => {
            source.cell = this.file.cell;
            return source;
        }));
    }
    addProperty(property: IProperty) {
        this.data.attributes.push(property);
    }
    addMethod(method: IMethod) {
        this.data.methods.push(method);
    }
}

function convert(chunks: IParsedFile[]) {

    interface IVisitors {
         /* FIXME: ctx is not any in fact – it's type of Context */
        [key: string]: (node: INode, ctx: any) => void;
    }

    const visitors: IVisitors = {
        default(node: INode, ctx: IHackyShitContext) {
            node && node.children && visit(node.children, ctx);
        },
        Interface(node: INode, ctx: Context) {
            ctx.setName(node.name);
            ctx.addSource(node.sources);
            node.comment && ctx.setDescription(node.comment.shortText);
            visit(node.children, ctx);
        },
        Method(node: INode, ctx: Context) {
            visit(node.signatures, ctx);
        },
        Property(node: INode, ctx: Context) {
            ctx.addProperty({
                name: node.name,
                description: node.comment && node.comment.shortText,
                type: node.type.name || node.type.types && node.type.types
                    .map((t: IResovedType) => t.name).join('|'), // FIXME: HACKY SHIT
                sources: node.sources, // TODO: merge with file
            });
        },
        'Call signature': (node: INode, ctx: Context) => {
            const method: IMethod = {
                name: node.name,
                description: node.comment && node.comment.shortText,
                type: node.type.name || node.type.types && node.type.types
                    .map((t: IResovedType) => t.name).join('|'), // FIXME: HACKY SHIT
            };
            ctx.addMethod(method);
            visit(node.parameters, method);
        },
        Parameter(node: INode, method: IMethod) {
            method.params = method.params || [];
            method.params.push({
                name: node.name,
                description: node.comment && node.comment.text,
                type: node.type.name || node.type.types && node.type.types
                    .map((t: IResovedType) => t.name).join('|'), // FIXME: HACKY SHIT
            });
        },
    };

    const result = [];

    for (const { reflection, file } of chunks) {
        const ctx = new Context(file);

        visit(reflection.children, ctx);
        result.push(ctx.result);
    }

    function visit(nodes: INode[] | undefined, ctx: IHackyShitContext): void {
        for (const node of ([] as any).concat(nodes)) {
            visitOne(node, ctx);
        }
    }

    function visitOne(node: INode, ctx: IHackyShitContext): void {
        visitors[node && node.kindString]
            ? visitors[node.kindString](node, ctx)
            : visitors.default(node, ctx);
    }

    return result;
}
