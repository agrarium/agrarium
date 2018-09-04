import { Plugin, IWalkSources } from '@agrarium/plugin';
import { IChunk, IBemFile } from '@agrarium/core';

export interface IMdPart {
    name: string;
    path: string;
    source: string | undefined;
}

export interface IExamplePart {
    path: string;
    source: string | undefined;
}

export class PluginDocs extends Plugin {
    async seed(chunk: IChunk<IBemFile>, context: any) {
        const md: IMdPart[] = [];
        const examples: IExamplePart[] = [];

        await this.walkSources({
            tech: 'example.rss',
            files: chunk.files,
        }, (result: IWalkSources) => {
            examples.push({
                path: result.file.path,
                source: result.source,
            });
        });

        await this.walkSources({
            tech: 'md',
            files: chunk.files,
        }, (result: IWalkSources) => {
            let source: string = result.source || '';
            const exampleRegexpResult = source.match(/example:([a-zA-Z].+)*.example.rss/g);
            const nameRegexpResult = source.match(/^## ([а-яА-Я]* *)*$/m);

            if (exampleRegexpResult) {
                exampleRegexpResult.forEach((example) => {
                    const exampleFilename: string = example.split(':')[1];
                    const exampleContent = getExampleContent(exampleFilename);
                    if (exampleContent) {
                        source = source.replace(example, exampleContent);
                    }
                });
            }

            md.push({
                name: nameRegexpResult ? nameRegexpResult[0].slice(3) : chunk.key,
                path: result.file.path,
                source: source || '',
            });
        });

        context.examples = examples;
        context.md = md;

        function getExampleContent(fileName: string) {
            for (let index = 0; index < examples.length; index = index + 1) {
                if (examples[index].path.includes(fileName)) {
                    return examples[index].source;
                }
            }
            return null;
        }
    }
}
