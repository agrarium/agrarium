const walk = require('@bem/sdk.walk');
const miss = require('mississippi');
const Readable = require('stream').Readable;
const toArray = require('stream-to-array');

const defaultGroupBy = file => file.entity.block;

module.exports = function({ plugins = [], src, groupBy, render }) {
    const output = new Readable({ objectMode: true, read: () => {}});
    const context = Object.create(null);

    (async () => {
        const introStream = walk(Object.keys(src), { levels: src });

        const intro = await toArray(introStream);

        const groupped = intro.reduce((res, file) => {
            const key = (groupBy || defaultGroupBy)(file);
            const capacitor = res[key] || (res[key] = []);
            capacitor.push(file);
            return res;
        }, {});

        const chunks = Object.keys(groupped).map((key) => {
            return ({ key, files: groupped[key] });
        });

        for (let chunk of chunks) {
            await Promise.all(plugins.map(f => f.seed && f.seed(chunk, context)));
        }
        for (let chunk of chunks) {
            output.push(chunk);
        }
    })()
        .catch(err => output.emit('error', err))
        .then(() => output.push(null));

    return output
        .pipe(miss.through.obj((chunk, _, cb) => {
            (async () => {
                chunk.data = Object.create(null);
                const res = await Promise.all(plugins.map(f => f.gather && f.gather(chunk, context)));
                Object.assign.apply(null, [].concat(chunk.data, res))
                cb(null, { chunk, context });
            })().catch(cb)
        }));
};
