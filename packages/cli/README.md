# Agrarium CLI

* [Usage](#usage)
* [Commands](#commands)

## Usage

```sh-session
$ npm install -g @agrarium/cli
$ agrarium COMMAND
$ agrarium (-v|--version|version)
@agrarium/cli/0.0.1 darwin-x64 node-v8.4.0
$ agrarium --help [COMMAND]
USAGE
  $ agrarium COMMAND
...
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
  -c, --config=config    Path to Agrarium config
  -d, --workdir=workdir  Working directory
  -e, --exec=exec        Path to chunk handler
  -j, --json             Export data as JSON
  -o, --output=output    Path to output file with harvested data
  -s, --silent           No info to stdout

EXAMPLE

  ❯ agrarium harvest
  ❯ agrarium harvest -o output.txt
  ❯ agrarium harvest -j -o path/to/harvest.json
  ❯ agrarium harvest --exec [path/to/worker.js](#worker)
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

By default Agrarium use `.agrarium.js` from your working directory.

``` js
const agrariumPreset = require('./agrarium/preset');
const AgrariumPlugin = require('./agrarium/plugin');

module.exports = {
    src: ['./components'],
    plugins: [
        agrariumPreset({/* options */}),
        new AgrariumPlugin({/* options */})
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

### License MIT
