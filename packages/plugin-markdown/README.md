# Agrarium Markdown Plugin

Agrarium plugin for markdown files resolving.

## Usage

```sh
npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/plugin-markdown
```

In your `.agrarium.js` file:

```js
const { PluginMarkdown } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new PluginMarkdown({/* options */})
    ]
}
```

## Example of result data

It returns content of markdown files in JSON. More info about PostHTMLTree [here](https://github.com/posthtml/posthtml-parser#result-posthtmltree).

`console.log(chunk.data)`
```
{
    markdown: [{
        lang: 'en',
        content: [/* json */],
        file: {
            path: 'test/fixtures/blocks/test-block/test-block.md'
        }
    }, {
        lang: 'en',
        content: [/* json */],
        file: {
            path: 'test/fixtures/blocks/test-block/_mod/test-block_mod.md'
        }
    }]
}
```

## Options

### json?: boolean, default: true

Returns content in JSON.

### html?: boolean, default: false

Returns content in HTML string.

### namespace?: string, default: undefined

Adds prefix for parsed classes.

### i18n: { langs: string[], default: string }, default: { langs: ['en'], default: 'en' }

Sets what langs you support in markdown. For example you can have: `button.md` and `button.ru.md`.

You need to set this option in your `.agrarium.js` file:
``` js
const { PluginMarkdown } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new PluginMarkdown({
            i18n: {
                langs: ['en', 'ru'],
                default: 'en'
            }
        })
    ]
};
```

### hooks

You can setup some hooks to modify markdown entites. It can be inline sources for example.

#### inlineSource?: (options: { lang: string, content: string }) => { src: string }

Parses inline sources in markdown and replace it with `iframe`. Example:

``` js
const builder = require('./builder');

agrarium({
    src: ['./src/components'],
    plugins: [
        new PluginMarkdown({
            hooks: {
                inlineSource({ lang, content } {
                    if (lang === 'js') {
                        builder(content);
                        return {
                            src: '/static/daweasc123da.html'
                        }
                    }
                }
            }
        })
    ]
});
```

## License MIT
