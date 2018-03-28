const chai = require('chai');
const chaiSubset = require('chai-subset');

const { agrarium } = require('@agrarium/test-helpers');
const { PluginList } = require('../src');

chai.use(chaiSubset);

const { expect } = chai;

describe('Agrarium: Plugin List', () => {

    it('passes collected data to the context', async () => {
        expect(await agrarium({
            src: ['./test/fixtures/components'],
            plugins: [
                new PluginList({
                    collect: (component) => ({
                        blocks: [component.key]
                    })
                })
            ]
        })).to.containSubset([{
            context: {
                blocks: ['c1']
            }
        }]);
    });

});
