const { describe, it } = require('mocha');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const sinon = require('sinon');

const { PluginMarkdown } = require('../src');

chai.use(chaiSubset);

const { expect } = chai;

describe('Agrarium: Plugin Markdown', function() {

    // it('returns parsed md for en', async () => {
    //     expect((await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginMarkdown()]
    //     }))).to.containSubset([{
    //         data: {
    //             markdown: [{
    //                 lang: 'en',
    //                 content: [],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/test-block.md'
    //                 }
    //             }, {
    //                 lang: 'en',
    //                 content: [],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/_mod/test-block_mod.md'
    //                 }
    //             }]
    //         }
    //     }]);
    // });

    // it('returns parsed md for en and ru', async () => {
    //     expect((await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginMarkdown({
    //             i18n: {
    //                 langs: ['en', 'ru'],
    //                 default: 'en'
    //             }
    //         })]
    //     }))).to.containSubset([{
    //         data: {
    //             markdown: [{
    //                 lang: 'en',
    //                 content: [],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/test-block.md'
    //                 }
    //             }, {
    //                 lang: 'en',
    //                 content: [],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/_mod/test-block_mod.md'
    //                 }
    //             }, {
    //                 lang: 'ru',
    //                 content: [],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/test-block.ru.md'
    //                 }
    //             }]
    //         }
    //     }]);
    // });


    // it('returns parsed md in html', async () => {
    //     expect((await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginMarkdown({
    //             html: true
    //         })]
    //     }))).to.containSubset([{
    //         data: {
    //             markdown: [{
    //                 lang: 'en',
    //                 content: '<h2 id="b-testblock">b:TestBlock</h2>\n<p>Test block for markdown plugin testing</p>\n<pre><code class="lang-js">console.log(&#39;yeah, boy!&#39;)\n</code></pre>\n',
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/test-block.md'
    //                 }
    //             }]
    //         }
    //     }]);
    // });

    // it('allows to call hook on inline sources', async () => {
    //     const hook = sinon.spy(() => {
    //     });
    //     await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginMarkdown({
    //             hooks: {
    //                 inlineSource: hook
    //             }
    //         })]
    //     });

    //     expect(hook.calledOnce).to.be.true;
    // });

    // it('allows to replace inline sources to iframe', async () => {
    //     const sourcesCollector = [];
    //     const result = await agrarium({
    //         src: ['test/fixtures/blocks'],
    //         plugins: [new PluginMarkdown({
    //             hooks: {
    //                 inlineSource: ({ lang, content }) => {
    //                     sourcesCollector.push(content);
    //                     return {
    //                         src: `http://mycode.com/${lang}`
    //                     };
    //                 }
    //             }
    //         })]
    //     });

    //     expect(sourcesCollector).to.be.eql(['console.log(\'yeah, boy!\')\n']);
    //     expect(result).to.containSubset([{
    //         data: {
    //             markdown: [{
    //                 lang: 'en',
    //                 content: [{
    //                     tag: 'pre',
    //                     content: [{
    //                         attrs: {
    //                             src: 'http://mycode.com/js'
    //                         },
    //                         tag: 'iframe'
    //                     }]
    //                 }],
    //                 file: {
    //                     path: 'test/fixtures/blocks/test-block/test-block.md'
    //                 }
    //             }]
    //         }
    //     }]);
    // });

});
