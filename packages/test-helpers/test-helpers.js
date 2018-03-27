const toArray = require('stream-to-array');
const agrarium = require('@agrarium/core');

async function getAgrarium({ src=[], plugins=[] }) {
    return (await toArray(agrarium({ src, plugins }))).map(({ component }) => component.data);
}

module.exports = {
    getAgrarium
};
