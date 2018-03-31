/// <reference types="@agrarium/types" />

import { PluginMarkdown } from '@agrarium/plugin-markdown';
import { IListCollection, PluginList } from '@agrarium/plugin-list';

export interface PresetDefaultSettings {
    i18n?: {
        langs: string[];
        default: string;
    };
    md?: {
        json?: boolean;
        html?: boolean;
        namespace?: string;
    };
    inlineSource: (options: { lang: string; content: string }) => { src: string };
}

const defaultSettings = {
    i18n: {
        // component.md is en
        // component.ru.md is ru
        langs: ['en', 'ru'],
        default: 'en',
    },
    md: {
        html: true,
        json: false,
        namespace: undefined,
    },
};

export default function presetDefault(settings: PresetDefaultSettings) {
    return [
        new PluginList({
            collect: (
                component: Agrarium.IComponent,
                context: Agrarium.IContext,
            ): IListCollection => ({
                components: context.components ?
                    ([] as string[]).concat(context.components, component.key) :
                    [component.key],
            }),
        }),
        new PluginMarkdown({
            i18n: settings.i18n || defaultSettings.i18n,
            html: settings.md && settings.md.html || defaultSettings.md.html,
            json: settings.md && settings.md.json || defaultSettings.md.json,
            namespace: settings.md && settings.md.namespace || defaultSettings.md.namespace,
            hooks: {
                inlineSource: settings.inlineSource,
            },
        }),
    ];
}
