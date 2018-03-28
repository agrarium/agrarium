/// <reference types="@types/agrarium" />

export interface IListCollection {
    [key: string]: any;
}

export type IListCollector = (
    component: Agrarium.IComponent,
    context: Agrarium.IContext,
) => IListCollection;

export interface PluginListSetting {
    collect: IListCollector;
}

export class PluginList implements Agrarium.IPlugin {

    private collect: IListCollector;

    constructor(settings: PluginListSetting) {
        this.collect = settings.collect;
    }

    seed(component: Agrarium.IComponent, context: Agrarium.IContext) {
        const collection = this.collect(component, context);
        Object.assign(context, collection);
    }
}
