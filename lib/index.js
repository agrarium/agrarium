const walk = require('@bem/sdk.walk');
const miss = require('mississippi');
const Readable = require('stream').Readable;
const toArray = require('stream-to-array');

const defaultGroupBy = file => file.entity.block;

module.exports = function({ farmers = [], config, groupBy, render }) {
    const output = new Readable({ objectMode: true, read: () => {}});
    const context = Object.create(null);

    (async () => {
        const introStream = walk(Object.keys(config.levels), config);

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
            await Promise.all(farmers.map(f => f.seed && f.seed(chunk, context)));
        }
        for (let chunk of chunks) {
            output.push(chunk);
        }
    })()
        .catch(err => output.emit('error', err))
        .then(() => output.push(null));

    const renderingTransform = !render ? miss.through.obj() : miss.through.obj(function (data, _, cb) {
        let result;
        try {
            result = render(data);
        } catch (e) {
            cb(e);
            return;
        }
        cb(null, { ...data, result });
    });

    return output
        .pipe(miss.through.obj((chunk, _, cb) => {
            (async () => {
                chunk.data = Object.create(null);
                const res = await Promise.all(farmers.map(f => f.gather && f.gather(chunk, context)));
                Object.assign.apply(null, [].concat(chunk.data, res))
                cb(null, { chunk, context });
            })().catch(cb)
        }))
        .pipe(renderingTransform);
};
