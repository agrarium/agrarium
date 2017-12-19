const path = require('path');
const typedocModule = require('typedoc');

/**
 * Plugin for gathering typescript definitions (*.d.ts files)
 */
module.exports = class AgrariumDTS {
    constructor() {
        this.files = [];
    }

    seed({ files }) {
        const dtsFiles = files.filter(f => f.tech === 'd.ts');
        [].push.apply(this.files, dtsFiles);
    }

    getParsedFiles_(files) {
        return (this.parsed || (this.parsed = new Promise(resolve => resolve(parse(files)))));
    }

    async gather({ key, files }) {
        const parsedFiles = await this.getParsedFiles_(this.files);
        const dts = parsedFiles.filter(({ file }) => files.includes(file));

        return { dts: convert(dts), key };
    }
};

function parse(files) {
    const app = new typedocModule.Application({
        includeDeclarations: true,
        excludeExternals: true
    });

    const filesByPath = files.reduce((acc, file) => {
        acc[path.resolve(file.path)] = file;
        return acc;
    }, {});

    const src = app.expandInputFiles(files.map(f => f.path));
    const projectReflection = app.convert(src);

    const ast = projectReflection.toObject();

    return ast.children.map(reflection => {
        const file = filesByPath[reflection.originalName];
        return { file, reflection };
    });
}

class Context {
    constructor(file) {
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
    setName(name) {
        this.data.name = name;
    }
    setDescription(text) {
        this.data.description = text;
    }
    addSource(sources) {
        [].push.apply(this.data.sources, sources.map(source => {
            source.cell = this.file.cell;
            return source;
        }));
    }
    addProperty(property) {
        this.data.attributes.push(property);
    }
    addMethod(method) {
        this.data.methods.push(method);
    }
}

function convert(chunks) {
    const visitors = {
        default(node, ctx) {
            node && node.children && visit(node.children, ctx);
        },
        Interface(node, ctx) {
            ctx.setName(node.name);
            ctx.addSource(node.sources);
            node.comment && ctx.setDescription(node.comment.shortText);
            visit(node.children, ctx);
        },
        Method(node, ctx) {
            visit(node.signatures, ctx);
        },
        Property(node, ctx) {
            ctx.addProperty({
                name: node.name,
                description: node.comment && node.comment.shortText,
                type: node.type.name || node.type.types && node.type.types.map(t => t.name).join('|'), // HACKY SHIT
                sources: node.sources, /** todo merge with file */
            });
        },
        'Call signature': (node, ctx) => {
            const method = {
                name: node.name,
                description: node.comment && node.comment.shortText,
                type: node.type.name || node.type.types && node.type.types.map(t => t.name).join('|'), // HACKY SHIT
            };
            ctx.addMethod(method);
            visit(node.parameters, method);
        },
        Parameter(node, method) {
            method.params = method.params || [];
            method.params.push({
                name: node.name,
                description: node.comment && node.comment.text,
                type: node.type.name || node.type.types && node.type.types.map(t => t.name).join('|'), // HACKY SHIT
            });
        }
    };

    const result = [];

    for(let {reflection, file} of chunks) {
        const ctx = new Context(file);

        visit(reflection.children, ctx);
        result.push(ctx.result);
    }

    function visit(reflection, ctx, meta) {
        for (let node of [].concat(reflection)) {
            visitOne(node, ctx, meta);
        }
    }

    function visitOne(node, file) {
        visitors[node && node.kindString]
            ? visitors[node.kindString](node, file)
            : visitors.default(node, file);
    }

    return result;
}
