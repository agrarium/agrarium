const { getAgrarium } = require('@agrarium/test-helpers');
const path = require('path');
const { describe, it } = require('mocha');
const chai = { expect } = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const PluginBemJSD = require('../plugin-bemjsd');

describe('Agrarium: Plugin BEM JSD', () => {

    it('should return jsdoc as json', async () => {
        expect(await getAgrarium({
            src: [path.resolve(__dirname, 'test-data/blocks')],
            plugins: [new PluginBemJSD()]
        })).to.containSubset([
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
            },
            {
                bemjsd: [{
                    jsd: {}
                }]
            }
        ]);
    });
});
