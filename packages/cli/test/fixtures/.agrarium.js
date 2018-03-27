const TestPlugin = require('./agrarium/plugin');

module.exports = {
    src: ['./components1'],
    plugins: [
        new TestPlugin({ field: 'instance1' }),
        [new TestPlugin({ field: 'instance2' })],
        [new TestPlugin({ field: 'instance3' })]
    ]
};
