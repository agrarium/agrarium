module.exports = {
    src: ['./components2'], // BECAUSE WE PASS CWD BY CLI
    plugins: [],
    transform: (chunk) => {
        chunk.myDinDinDon = true;
        return chunk;
    }
};
