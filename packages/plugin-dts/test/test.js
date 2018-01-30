/* global getAgrarium */
const path = require('path');

const { describe, it } = require('mocha');
const chai = { expect } = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const PluginDTS = require('../plugin-dts');

describe('Agrarium: Plugin DTS', function() {
    this.timeout(30000);

    it('should return defined attrs and methods', async () => {
        expect((await getAgrarium([
            path.resolve(__dirname, 'test-data/blocks/common'),
            path.resolve(__dirname, 'test-data/blocks/touch')
        ], [
            new PluginDTS()
        ]))).to.containSubset([
            {
                dts: [
                {
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
                    attributes: [
                        { name: 'answer', type: 'boolean|string', description: 'Description for answer attribute extension' }
                    ],
                    methods: [
                        {
                            name: 'onClick',
                            type: 'void',
                            description: 'Different signature for onClick',
                            params: [
                                { name: 'e', type: 'object', description: 'dom event' },
                                { name: 'data', type: 'object', description: 'event data\n' }
                            ]
                        },
                        {
                            name: 'onExit',
                            type: 'void',
                            description: 'Yet another one method'
                        }
                    ]
                },
                {
                    name: 'TestBlock',
                    sources: [{
                        fileName: 'common/test-block/test-block.d.ts',
                        line: 4,
                        character: 26,
                        cell: {
                            entity: { block: 'test-block' },
                            tech: 'd.ts'
                        }
                    }],
                    description: 'Interface for TestBlock',
                    attributes: [
                        { name: 'answer', type: 'boolean', description: 'Description for answer attribute' },
                        { name: 'count', type: 'number', description: 'Description for count attribute' },
                    ],
                    methods: [
                        {
                            name: 'onClick',
                            type: 'void',
                            description: 'Description for onClick signature',
                            params: [
                                { name: 'e', type: 'object', description: 'dom event\n' }
                            ]
                        }
                    ],
                },
                {
                    name: 'TestBlock',
                    sources: [{
                        fileName: 'touch/test-block/test-block.d.ts',
                        line: 4,
                        character: 26,
                        cell: {
                            entity: { block: 'test-block' },
                            tech: 'd.ts'
                        }
                    }],
                    description: 'Touch addition',
                    attributes: [
                        { name: 'count', type: 'object', description: 'It\'s object on touch' }
                    ],
                    methods: [
                        {
                            name: 'onTouchStart',
                            type: 'void',
                            description: 'Special method for touch',
                        }
                    ]
                }/*, {
                    name: 'TestBlockElem',
                    sources: [{
                        path: {},
                        cell: {},
                    }],
                    description: 'Elem interface',
                    attributes: [
                        { name: 'count', type: 'object', description: 'It\'s object on touch' }
                    ]
                }*/]
            }, {
                dts: [{
                    name: 'TestBlock2',
                    sources: [{
                        fileName: 'common/test-block2/test-block2.d.ts',
                        line: 1,
                        character: 27,
                        cell: {
                            entity: { block: 'test-block2' },
                            tech: 'd.ts'
                        }
                    }],
                    attributes: [
                        { name: 'color', type: 'string', description: 'Colorful description' }
                    ]
                }]
            }
        ]);
    });
});
