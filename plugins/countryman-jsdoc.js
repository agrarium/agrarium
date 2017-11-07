const commentParser = require('comment-parser');
const Plugin = require('../lib/Plugin');

let first = true;
module.exports = class CountrymanJSDoc extends Plugin {
    gather({ key, files }) {
        // const methods = Object.create(null);
        // const jsdoc = {};

        // for (let file of files.filter(f => f.tech === 'js')) {
        //     const content = commentParser(await this.readFile(file));
        //     // console.log(content.map(c => c.tags.map(t => t.source)));
        // }

        // babelCore.transpile(js, {
        //     plugins: [
        //         function({ types }) {
        //             return {
        //                 visitor: {
        //                     CallExpression: function(p, context) {

        //                     },

        //                 }
        //             }
        //         }
        //     ]
        // })


        const methods = first ? {
            funcName: {
                description: 'Some useless shit, dont use this',
                params: [
                    {name: 'foo', type: 'String', description: 'foo description'},
                    {name: 'bar', type: 'String', description: 'bar description'}
                ],
                returns: { type: 'String', description: 'It will hurt you' },

                extensions: [
                    {
                        mod: {name: 'theme', val: 'islands'},
                        params: [
                            {name: 'foo', type: 'String|Array', description: 'foo description'},
                            {name: 'bar', type: 'String', description: 'bar description'},
                            {name: 'baz', type: 'String', description: 'baz description'}
                        ],
                        returns: { type: 'Object', description: 'It will really hurt you' }
                    }
                ]
            }
        } : {};
        first = false;

        return { methods };
    }
}
