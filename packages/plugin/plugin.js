const { readFile } = require('fs');
const { promisify } = require('util');

const read = promisify(readFile);

class Plugin {
    readFile({ path }) {
        Plugin.files.has(path) || Plugin.files.set(path, read(path, 'utf-8'));
        return Plugin.files.get(path);
    }

    async walkSources({ tech, files }, cb) {
        for (let file of files.filter(f => f.tech.endsWith(tech))) {
            const source = await this.readFile(file);

            cb({ source, file });
        }
    }
}

Plugin.files = new Map();

module.exports = Plugin;
