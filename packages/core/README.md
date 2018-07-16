# Agrarium Core

Agrarium stream engine wich provides interface for microplugins infrastructure. Every plugin can get any data from any resource. Usually it is file system, but it also can be remote resource or whatewhere you want ;) Read more about plugins API [here](../plugin) and write your own the best plugin!

## Usage

```sh
$ npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/core
```

Anywhere in your code:

```js
const { agrarium, PluginDTS } = require('agrarium');

agrarium({
    src: ['./src/components'],
    plugins: [
        new PluginDTS({/* options */})
    ]
});
```

## Options

### src: string[]

Set of paths to the sources.

### plugins: [IPlugin](../types/index.d.ts)[]

Set of plugins or presets.

### transform?: (chunk: [IChunk](../types/index.d.ts)) => {}

Use this function if you need to transform chunk. For example you can add or remove any data from every chunk.

### cwd?: string

Custom path to project cwd.

### groupBy?: (file: [BEMSDK.IFile](../types/index.d.ts)) => string

Use this function to sort and group found entties. Grouped by component by default.

## Types Definitions

All interfaces defined in the public package `[@agrarium/types](../types/index.d.ts)`.

## License MIT
