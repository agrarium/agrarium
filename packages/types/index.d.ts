// Type definitions for Agrarium
// Project: https://github.com/agrarium/agrarium
// Definitions by: Microsoft TypeScript <http://typescriptlang.org>
//                 DefinitelyTyped <https://github.com/DefinitelyTyped/DefinitelyTyped>
//                 Anton Vingoradov <https://github.com/awinogradov>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Agrarium {

    export interface IComponentDataPart {
        [key: string]: any;
    }

    export type fileSource = string | undefined;
    export interface IReadFileOptions {
        path: string;
    }
    export type ISeedResult = IComponentDataPart | void;
    export interface IWalkSourcesOptions {
        tech: string,
        files: IBemEntity[]
    }
    export interface IWalkSourcesResult {
        source: Agrarium.fileSource;
        file: Agrarium.IBemEntity;
    }

    export interface IPlugin {
        gather?: (component: IComponent, context: IContext) => IComponentDataPart;
        seed?: (component: IComponent, context: IContext) => ISeedResult;
        readFile?: (options: IReadFileOptions) => Promise<fileSource>;
        walkSources?: (options: IWalkSourcesOptions, cb: (result: IWalkSourcesResult) => void) => void;
    }

    export interface IBemEntity {
        cell: {
            entity: {
                block: string;
                elem?: string;
                mod?: {
                    name: string;
                    val: string|boolean
                }
            };
        };
        tech: string;
        path: string;
        level: string;
        file: IBemEntity;
    }

    export interface IConfig {
        src: string[];
        plugins: Plugin[]|Plugin[][];
        transform?: (chunk: IChunk) => {};
        cwd?: string;
    }

    export interface IComponent {
        key: string;
        files: IBemEntity[]
        data: {
            [key: string]: any;
        };
        config: IConfig;
    }

    export interface IContext {
        [key: string]: any;
    }

    export interface IChunk {
        component: IComponent;
        context: IContext;
    }

}

// FIXME: It doesn't have declaration file
declare module 'mississippi';
declare module 'posthtml';
declare module 'postmd';
declare module 'postmd/plugins/postmd-bemjson';
declare module 'bem-jsd';
