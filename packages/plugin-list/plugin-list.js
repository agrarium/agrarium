module.exports = class AgrariumList {
    constructor(options = {}) {
        this.hook = options.hook || (() => {});
    }
    
    seed(chunk) {
        this.hook(chunk);
    }
}
