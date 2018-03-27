const { join } = require('path');
const walk = require('@bem/sdk.walk');
const miss = require('mississippi');
const { Readable } = require('stream');
const toArray = require('stream-to-array');

const defaultGroupBy = file => file.entity.block;
const resolvePaths = (cwd, paths) => paths.map(p => join(cwd, p));

module.exports = function agrarium(config) {
    const { plugins = [], src, groupBy } = config;
    let { cwd } = config;
    const output = new Readable({ objectMode: true, read: () => {}});
    const context = Object.create(null);

    cwd = cwd || '';

    (async () => {
        let levels, walkerConfig;

        if (Array.isArray(src)) {
            levels = resolvePaths(cwd, src);
            walkerConfig = {
                levels: levels.reduce((acc, lvl) => {
                    acc[lvl] = {/* default settings */};
                    return acc;
                }, {})
            };
        } else if (typeof src === 'object') {
            levels = resolvePaths(cwd, Object.keys(src));
            walkerConfig = {
                levels: levels.reduce((acc, lvl) => {
                    acc[resolvePaths(cwd, lvl)] = src[lvl];
                    return acc;
                }, {})
            };
        } else {
            throw Error('Unsupported src type');
        }

        const introStream = walk(levels, walkerConfig);

        const intro = await toArray(introStream);

        const groupped = intro.reduce((res, file) => {
            const key = (groupBy || defaultGroupBy)(file);
            const capacitor = res[key] || (res[key] = []);
            capacitor.push(file);
            return res;
        }, {});

        const chunks = Object.keys(groupped).map((key) => {
            return ({ key, files: groupped[key], config });
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
                Object.assign.apply(null, [].concat(chunk.data, res));
                cb(null, { component: chunk, context });
            })().catch(cb);
        }));
};
