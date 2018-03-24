# Agrarium Default Preset

The minimal Agrarium preset for simple projects.

## Usage

```sh
npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/preset-default
```

In your `.agrarium.js` file:

```js
const { presetDefault } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new presetDefault({ /* options */})
    ]
};
```

## Plugins

- [List](../plugin-list)
- [Markdown](../plugin-markdown)

## Options

### i18n: { langs: string[], default: string }, default: { langs: ['en', 'ru'], default: 'en' }

### md: { html: boolean, json: boolean, namespace: string | undefined }, default: { html: true }

## License MIT
