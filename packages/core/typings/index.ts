import * as Vinyl from 'vinyl';

export type Next<C> = (err?: Error | null, chunk?: C) => void;

export interface IChunk<F = Vinyl> {
    id: string;
    key: string;
    options: IStreamResolverOptions;
    context: Record<string, any>;
    data: Record<string, any>;
    files: F[];
}

export interface IPlugin {
    gather?: (chunk: any, context: Record<string, any>) => Record<string, any>;
    seed?: (chunk: any, context: Record<string, any>) => Record<string, any> | void;
}

export interface IStreamResolverOptions {
    read?: boolean;
    cwd?: string;
}

export interface IBemEntityName {
    block: string;
    elem?: string;
    mod?: {
        name: string;
        val?: boolean | string;
    };
}

export interface IBemCell {
    entity: IBemEntityName;
    tech: string;
    layer: string;
}

export interface IBemFile extends IBemCell {
    cell: IBemCell;
    level: string;
    path: string;
}
