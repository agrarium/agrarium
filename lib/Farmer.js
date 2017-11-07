const { readFile } = require('fs');
const { promisify } = require('util');

const read = promisify(readFile);

class Farmer {
    readFile({ path }) {
        Farmer.files.has(path) || Farmer.files.set(path, read(path, 'utf-8'));
        return Farmer.files.get(path);
    }
}

Farmer.files = new Map();

module.exports = Farmer;
