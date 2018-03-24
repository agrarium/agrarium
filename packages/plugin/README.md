# Agrarium Plugin

Base class for plugins implementations. Every plugin is the simple JS class wich needs to provide some public interface for Agrarium.

## Public interface

Both methods `gather` and `seed` have the same signature but they have a diffrent time of execution.

### gather?: (component: [IComponent](../types/index.d.ts), context: [IContext](../types/index.d.ts)) => [IComponentDataPart](../types/index.d.ts)

It's async method wich returns simple object any mined data in keys. This method works in parallel in all chunks. Also, order of this method executions in different plugins not garanted.

Example:

```js
const { Plugin } = require('agrarium');
const FormData = require('form-data');

// Fetching data by http request
class MyPlugin extends Plugin {
    async gather({ key }) {
        const form = new FormData();
        form.append('component', key);
        return {
            my: await got.post('myApiWithComponentsInfo.ru', {
                body: form
            })
        };
    }
}
```


### seed?: (component: [IComponent](../types/index.d.ts), context: [IContext](../types/index.d.ts)) => [ISeedResult](../types/index.d.ts)

It's also async method wich returns simple object any mined data in keys. This method works before main stream of the `gather` methods and you can use this information in the any gather method of any plugin. Also, order of this method executions in different plugins not garanted.

Example:

```js
const { Plugin } = require('agrarium');

// Collectiong components names
class MyPlugin extends Plugin {
    async seed({ key }, context) {
        return {
            components: context.components ?
                [].concat(context.components, component.key) :
                [component.key]
        };
    }
}
```

## Private interface

It's set of helpers for better plugins writing experience.

### readFile?: (options: [IReadFileOptions](../types/index.d.ts)) => Promise<[fileSource](../types/index.d.ts)>

Simple helper for reading files from fs with cache.

### walkSources?: (options: [IWalkSourcesOptions](../types/index.d.ts), cb: (result: [IWalkSourcesResult](../types/index.d.ts)) => void) => void

Iterator for files and thier sources.

## License MIT
