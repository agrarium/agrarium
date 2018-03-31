/// <reference types="@agrarium/types" />

const streamToArray = require('stream-to-array');
const { agrarium: core }  = require('@agrarium/core');

export interface ISimpleChunk {
    data?: Agrarium.IComponentDataPart;
    context: Agrarium.IContext;
}

export async function agrarium(config: Agrarium.IConfig) {
    const data: Agrarium.IChunk[] = await streamToArray(core(config));
    return data.map((chunk: Agrarium.IChunk): ISimpleChunk => ({
        data: chunk.component.data,
        context: chunk.context,
    }));
}
