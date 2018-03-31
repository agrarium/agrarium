# Agrarium CLI

Simple CLI tool for collecting data in terminal.

## Usage

```sh-session
$ npm install -g @agrarium/cli
$ agrarium COMMAND
$ agrarium (-v|--version|version)
$ agrarium --help [COMMAND]
```

## Commands

* [agrarium harvest](#harvest-command)
* [agrarium help [COMMAND]](#help-command)

### harvest

Collect all data for components.

```
USAGE
  $ agrarium harvest

OPTIONS
  -c, --config=p/t/config       Path to Agrarium config
  -d, --workdir=my/cwd          Working directory
  -j, --json                    Export data as JSON
  -o, --output=file.json        Path to output file with harvested data
  -s, --silent                  No info to stdout
  --concurently=/lib/worker.js  Path to chunk worker
  --flush=/lib/prepareData.js   Path to result transformer

EXAMPLE

  ❯ agrarium harvest
  ❯ agrarium harvest -o output.txt
  ❯ agrarium harvest -j -o path/to/harvest.json
  ❯ agrarium harvest --concurenty path/to/worker.js
  ❯ agrarium harvest --flush path/to/worker.js
  ❯ agrarium harvest -c ../.agrarium.js -c path/to/one/more/.agrarium.js
  ❯ agrarium harvest -j | xargs echo > ./file.json
  ❯ agrarium harvest | builder
```

### help

Display help for agrarium command.

```
USAGE
  $ agrarium help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

## Configure

### Agrarium config

By default Agrarium uses `.agrarium.js` from your working directory.

``` js
const { presetDefault, PluginDTS } = require('agrarium');

module.exports = {
    src: ['./components'],
    plugins: [
        presetDefault({/* options */}),
        new PluginDTS({/* options */})
    ],
    transform: /* optional */ function(chunk) {
        // Customiize your data by chunk
        return chunk;
    }
};
```

### Worker

It any module wich you can use to build|compile|whatever for every chunk.

``` js
module.exports = function worker(chunk) {
    setTimeout(() => {
        console.log(chunk.component.key);
    }, 0);
}
```

### Flush

It any module wich you can use transform result data before output.

``` js
module.exports = function flush(data) {
    data.push('hi hi ;)');
    return data;
}
```

### License MIT
