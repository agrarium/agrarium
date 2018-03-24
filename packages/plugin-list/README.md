# Agrarium List Plugin

Agrarium plugin for collecting anything to the component context.

## Usage

```sh
npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/plugin-list
```

In your `.agrarium.js` file:

```js
const { PluginList } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new PluginList({
            collect: (component, context) => ({
                components: context.components ?
                    [].concat(context.components, component.key) :
                    [component.key]
            })
        })
    ]
};
```

## Example of result data

`console.log(chunk.context)`

```
{
    components: ['button', 'input', ...]
}
```

## License MIT
