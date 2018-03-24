# Agrarium

Toolkit to collect information about components with microplugin infrastructure.

## Usage

```sh
npm i agrarium
```

### CLI

Put `.agrarium.js` config to the root of your project.

``` js
const { presetDefault, PluginDTS } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        presetDefault({/* options */}),
        new PluginDTS({/* options */})
    ]
};
```

Read more info about config [here](packages/cli#agrarium-config).

Run in terminal:

```sh-session
$ agrarium harvest --json -o data.json
```

Read more about CLI commands [here](packages/cli#harvest).

### Node API

```js
const { agrarium, presetDefault, PluginDTS } = require('agrarium');

agrarium({
    src: ['./src/components'],
    plugins: [
        presetDefault({/* options */}),
        new PluginDTS({/* options */})
    ]
}); // -> Readable Stream
```

Read more about NodeJS usage [here](packages/core).

## Plugins

- [Markdown](packages/plugin-markdown)
- [List](packages/plugin-list)
- [BemJSD](packages/plugin-bemjsd)
- [Types Definitions](packages/plugin-dts)

Not enough? [Build your own plugin!](#build-your-own-plugin)

## Presets

- [Default](packages/preset-default)

## Examples

- [React components](https://github.com/agrarium/example-bem-react)
- [BEM components](https://github.com/agrarium/example-bem-origin)
- [Gulp builder](https://github.com/agrarium/example-bem-builder-origin)

## Build your own plugin

```js
const { Plugin } = require('agrarium');

class AwesomePlugin extends Plugin {
    async gather({ key, files }) {
        return { filesQty: files.length };
    }
}

agrarium({
    src: ['./src/components' ],
    plugins: [
        new AwesomePlugin()
    ]
}).on('data', ({ key, files, data }) => {
    console.log(data); // { filesQty }
}).resume();
```

Read more about plugins API [here](packages/plugin).

## License MIT
