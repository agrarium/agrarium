# Agrarium BemJSD Plugin

Agrarium plugin for BEM JSDoc. More info about JSD parser [here](https://github.com/bem/bem-jsd).

## Usage

```sh
npm i agrarium
```

Or use it standalone:

```sh
npm i @agrarium/plugin-bemjsd
```

In your `.agrarium.js` file:

```js
const { PluginBemJSD } = require('agrarium');

module.exports = {
    src: ['./src/components'],
    plugins: [
        new PluginBemJSD()
    ]
};
```

## Example of result data

`console.log(chunk.data)`

```
{
    bemjsd: [{
        jsd: {
            "jsdocType": "root",
            "modules": [
                {
                    "jsdocType": "module",
                    "name": "button",
                    "exports": {
                        "jsdocType": "class",
                        "name": "button",
                        "proto": {
                            "jsdocType": "type",
                            "jsType": "Object",
                            "props": [
                                {
                                    "key": "getText",
                                    "val": {
                                        "jsdocType": "type",
                                        "jsType": "Function",
                                        "returns": {
                                            "jsdocType": "returns",
                                            "description": "",
                                            "jsType": "String"
                                        },
                                        "description": "Returns text of the button"
                                    }
                                },
                                {
                                    "key": "setText",
                                    "val": {
                                        "jsdocType": "type",
                                        "jsType": "Function",
                                        "params": [
                                            {
                                                "jsdocType": "param",
                                                "name": "text",
                                                "description": "",
                                                "jsType": "String"
                                            }
                                        ],
                                        "returns": {
                                            "jsdocType": "returns",
                                            "description": "this",
                                            "jsType": "button"
                                        },
                                        "description": "Sets text to the button"
                                    }
                                }
                            ]
                        },
                        "augments": {
                            "jsdocType": "type",
                            "jsType": "control"
                        },
                        "bem": {
                            "jsdocType": "bem",
                            "block": "button"
                        }
                    },
                    "classes": {
                        "button": {
                            "jsdocType": "class",
                            "name": "button",
                            "proto": {
                                "jsdocType": "type",
                                "jsType": "Object",
                                "props": [
                                    {
                                        "key": "getText",
                                        "val": {
                                            "jsdocType": "type",
                                            "jsType": "Function",
                                            "returns": {
                                                "jsdocType": "returns",
                                                "description": "",
                                                "jsType": "String"
                                            },
                                            "description": "Returns text of the button"
                                        }
                                    },
                                    {
                                        "key": "setText",
                                        "val": {
                                            "jsdocType": "type",
                                            "jsType": "Function",
                                            "params": [
                                                {
                                                    "jsdocType": "param",
                                                    "name": "text",
                                                    "description": "",
                                                    "jsType": "String"
                                                }
                                            ],
                                            "returns": {
                                                "jsdocType": "returns",
                                                "description": "this",
                                                "jsType": "button"
                                            },
                                            "description": "Sets text to the button"
                                        }
                                    }
                                ]
                            },
                            "augments": {
                                "jsdocType": "type",
                                "jsType": "control"
                            },
                            "bem": {
                                "jsdocType": "bem",
                                "block": "button"
                            }
                        }
                    }
                }
            ]
        }
    }]
}
```

## License MIT
