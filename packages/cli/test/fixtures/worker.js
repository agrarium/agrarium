module.exports = function worker(chunk) {
    setTimeout(() => {
        console.log(chunk.component.key);
    }, 0);
}
