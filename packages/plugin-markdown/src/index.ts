/// <reference types="@types/agrarium" />

import * as PostMD from 'postmd';
import * as bemjson from 'postmd/plugins/postmd-bemjson';
import { join } from 'path';
import * as posthtml from 'posthtml';
import { Plugin } from '@agrarium/plugin';

const htmlEntities: {
    [key: string]: string;
} = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
};

const decodeHtmlEntities = (string: string): string => {
    return string.replace(/&(\w+|#\d+);/gi, (_, substring) => {
        const n = parseInt(substring.replace('#', ''), 10);
        if (isNaN(n)) {
            return htmlEntities[substring] || substring;
        }

        return String.fromCharCode(n);
    });
};

export interface IPluginMarkdownHooks {
    inlineSource?: (options: { lang: string, content: string }) => { src: string };
}

export interface IPluginMarkdownOptions {
    namespace?: string;
    json?: boolean;
    html?: boolean;
    hooks?: IPluginMarkdownHooks;
    i18n: {
        langs: string[];
        default: string;
    };
}

export interface IResultPart {
    lang: string;
    file: Agrarium.IBemEntity;
    content: string | { [key: string] : any };
}

const defaultPluginOptions = {
    json: true,
    html: false,
    hooks: {},
    i18n: {
        langs: ['en'],
        default: 'en',
    },
};

export class PluginMarkdown extends Plugin {
    private json: boolean;
    private html: boolean;
    private namespace: string | undefined;
    private hooks: IPluginMarkdownHooks;
    private langs: string[];
    private defaultLang: string;

    constructor(options: IPluginMarkdownOptions) {
        super();

        const resolvedOpts = Object.assign({}, defaultPluginOptions, options);

        this.json = resolvedOpts.json;
        this.html = resolvedOpts.html;
        this.namespace = resolvedOpts.namespace;
        this.hooks = resolvedOpts.hooks;
        this.langs = resolvedOpts.i18n.langs;
        this.defaultLang = resolvedOpts.i18n.default;
    }

    async gather(component: Agrarium.IComponent) {
        const markdown: IResultPart[] = [];
        const parsed: IResultPart[] = [];
        const grouped = {};
        const langs: Set<string> = new Set();

        await this.walkSources({
            tech: 'md',
            files: component.files,
        }, (result: Agrarium.IWalkSourcesResult) => {
            const lang: string = result.file.tech.replace(/\.?md/, '') || this.defaultLang;

            langs.add(lang);

            const content = PostMD(result.source, {
                transform: {
                    format: 'json',
                    plugins: [
                        this.json && bemjson({ scope: this.namespace }),
                    ].filter(Boolean),
                },
            });

            const posthtmlPlugins = [];

            if (this.hooks.inlineSource) {
                posthtmlPlugins.push(((tree: any) => {
                    tree.match({ tag: 'code', attrs: { class: true } }, (node: any) => {
                        const content = decodeHtmlEntities(node.content.join(''));
                        const sourceLang = node.attrs.class.replace('lang-', '');
                        const changedContent: {
                            src: string;
                        } | undefined = this.hooks.inlineSource && this.hooks.inlineSource({
                            content,
                            lang: sourceLang,
                        });

                        if (changedContent) {
                            node.tag = 'iframe';
                            node.attrs = { src: changedContent.src };
                            node.content = null;
                        }

                        return node;
                    });

                    return tree;
                }));
            }

            const tranformed = posthtml(
                posthtmlPlugins.filter(Boolean),
            ).process(content, { skipParse: true, sync: true });

            parsed.push({
                lang,
                file: result.file,
                content: this.html ? tranformed.html : tranformed.tree,
            });
        });

        const addChunkByQuery = (lang: string) => (query: (chunk: IResultPart) => boolean) => {
            for (const chunk of parsed.filter(query)) {
                markdown.push({ ...chunk, lang });
            }
        };

        // add what we found on fs
        const emptyLangs = this.langs.filter((lang: string) => {
            const inTheFiles = Array.from(langs).includes(lang);
            addChunkByQuery(lang)(chunk => chunk.lang === lang);
            return !inTheFiles;
        });

        // fill unfound with default
        for (const lang of emptyLangs) {
            // TODO: log warning for this langs, like a linter
            addChunkByQuery(lang)(chunk => chunk.lang === this.defaultLang);
        }

        return { markdown };
    }
}
