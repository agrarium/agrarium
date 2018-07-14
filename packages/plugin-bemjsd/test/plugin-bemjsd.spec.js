const { describe, it } = require('mocha');
const chai = require('chai');
const chaiSubset = require('chai-subset');

const { PluginBemJSD } = require('../src');

chai.use(chaiSubset);

const { expect } = chai;

describe('Agrarium: Plugin BEM JSD', () => {

    // it('returns jsdoc as json', async () => {
    //     expect(await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginBemJSD()]
    //     })).to.containSubset([
    //         {
    //             data: {
    //                 bemjsd: [{
    //                     jsd: {
    //                         "jsdocType": "root",
    //                         "modules": [
    //                             {
    //                                 "jsdocType": "module",
    //                                 "name": "button",
    //                                 "exports": {
    //                                     "jsdocType": "class",
    //                                     "name": "button",
    //                                     "proto": {
    //                                         "jsdocType": "type",
    //                                         "jsType": "Object",
    //                                         "props": [
    //                                             {
    //                                                 "key": "getText",
    //                                                 "val": {
    //                                                     "jsdocType": "type",
    //                                                     "jsType": "Function",
    //                                                     "returns": {
    //                                                         "jsdocType": "returns",
    //                                                         "description": "",
    //                                                         "jsType": "String"
    //                                                     },
    //                                                     "description": "Returns text of the button"
    //                                                 }
    //                                             },
    //                                             {
    //                                                 "key": "setText",
    //                                                 "val": {
    //                                                     "jsdocType": "type",
    //                                                     "jsType": "Function",
    //                                                     "params": [
    //                                                         {
    //                                                             "jsdocType": "param",
    //                                                             "name": "text",
    //                                                             "description": "",
    //                                                             "jsType": "String"
    //                                                         }
    //                                                     ],
    //                                                     "returns": {
    //                                                         "jsdocType": "returns",
    //                                                         "description": "this",
    //                                                         "jsType": "button"
    //                                                     },
    //                                                     "description": "Sets text to the button"
    //                                                 }
    //                                             }
    //                                         ]
    //                                     },
    //                                     "augments": {
    //                                         "jsdocType": "type",
    //                                         "jsType": "control"
    //                                     },
    //                                     "bem": {
    //                                         "jsdocType": "bem",
    //                                         "block": "button"
    //                                     }
    //                                 },
    //                                 "classes": {
    //                                     "button": {
    //                                         "jsdocType": "class",
    //                                         "name": "button",
    //                                         "proto": {
    //                                             "jsdocType": "type",
    //                                             "jsType": "Object",
    //                                             "props": [
    //                                                 {
    //                                                     "key": "getText",
    //                                                     "val": {
    //                                                         "jsdocType": "type",
    //                                                         "jsType": "Function",
    //                                                         "returns": {
    //                                                             "jsdocType": "returns",
    //                                                             "description": "",
    //                                                             "jsType": "String"
    //                                                         },
    //                                                         "description": "Returns text of the button"
    //                                                     }
    //                                                 },
    //                                                 {
    //                                                     "key": "setText",
    //                                                     "val": {
    //                                                         "jsdocType": "type",
    //                                                         "jsType": "Function",
    //                                                         "params": [
    //                                                             {
    //                                                                 "jsdocType": "param",
    //                                                                 "name": "text",
    //                                                                 "description": "",
    //                                                                 "jsType": "String"
    //                                                             }
    //                                                         ],
    //                                                         "returns": {
    //                                                             "jsdocType": "returns",
    //                                                             "description": "this",
    //                                                             "jsType": "button"
    //                                                         },
    //                                                         "description": "Sets text to the button"
    //                                                     }
    //                                                 }
    //                                             ]
    //                                         },
    //                                         "augments": {
    //                                             "jsdocType": "type",
    //                                             "jsType": "control"
    //                                         },
    //                                         "bem": {
    //                                             "jsdocType": "bem",
    //                                             "block": "button"
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 }]
    //             }
    //         },
    //         {
    //             data: {
    //                 bemjsd: [{
    //                     jsd: {}
    //                 }]
    //             }
    //         }
    //     ]);
    // });
});
