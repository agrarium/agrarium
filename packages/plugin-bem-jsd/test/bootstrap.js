const toArray = require('stream-to-array');
const agrarium = require('@agrarium/core');

module.exports = global.getAgrarium = getAgrarium;

async function getAgrarium(src=[], plugins=[]) {
    return (await toArray(agrarium({ src, plugins }))).map(({ chunk }) => chunk.data);
}
