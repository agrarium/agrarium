// Type definitions for Agrarium
// Project: https://github.com/agrarium/agrarium
// Definitions by: Anton Vingoradov <https://github.com/awinogradov>
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
        files: BEMSDK.IFile[]
    }
    export interface IWalkSourcesResult {
        source: Agrarium.fileSource;
        file: BEMSDK.IFile;
    }

    export interface IPlugin {
        gather?: (component: IComponent, context: IContext) => IComponentDataPart;
        seed?: (component: IComponent, context: IContext) => ISeedResult;
        readFile?: (options: IReadFileOptions) => Promise<fileSource>;
        walkSources?: (options: IWalkSourcesOptions, cb: (result: IWalkSourcesResult) => void) => void;
    }

    export interface IConfig {
        src: string[];
        plugins: IPlugin[];
        transform?: (chunk: IChunk) => {};
        cwd?: string;
        groupBy?: (file: BEMSDK.IFile) => string;
    }

    export interface IComponent {
        key: string;
        files: BEMSDK.IFile[]
        data?: IComponentDataPart;
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

// TODO: drop it after https://github.com/bem/bem-sdk/issues/300
declare namespace BEMSDK {

    export interface IEntityName {
        block: string;
        elem?: string;
        mod?: {
            name: string;
            val?: true | string;
        }
    }

    export interface ICell {
        entity: IEntityName;
        tech: string;
        layer: string;
    }

    export interface IFile extends ICell {
        cell: ICell;
        level: string;
        path: string;
    }

    export interface IWalkConfig {
        levels: ILevelsList;
        defaults: {
            naming: any;
        }
    }

    export interface ILevelConfig {
        schema?: 'nested' | 'flat';
        naming?: 'react' | 'origin' | 'two-dashes';
    }

    export interface ILevelsList {
        [key: string]: ILevelConfig;
    }

}
