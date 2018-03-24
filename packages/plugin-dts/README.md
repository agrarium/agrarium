# Agrarium Types Definitions Plugin

Agrarium plugin for types definitions resolving. It parses `*.d.ts` files to `data.dts` key in result.

## Usage

```sh
npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/plugin-dts
```

In your `.agrarium.js` file:

```js
const { PluginDTS } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new DTS()
    ]
};
```

## Example of result data

`console.log(chunk.data)`
```
{
    dts: {
        name: 'TestBlock',
        sources: [{
            fileName: 'common/test-block/_mod/test-block_mod.d.ts',
            line: 1,
            character: 26,
            cell: {
                entity: { block: 'test-block', mod: { name: 'mod', val: true } },
                tech: 'd.ts'
            }
        }],
        attributes: [{
            name: 'answer',
            type: 'boolean|string',
            description: 'Description for answer attribute extension'
        }],
        methods: [{
            name: 'onClick',
            type: 'void',
            description: 'Different signature for onClick',
            params: [
                { name: 'e', type: 'object', description: 'dom event' },
                { name: 'data', type: 'object', description: 'event data\n' }
            ]
        }, {
            name: 'onExit',
            type: 'void',
            description: 'Yet another one method'
        }]
    }
}
```

[More examples](test) in specs.

## License MIT
