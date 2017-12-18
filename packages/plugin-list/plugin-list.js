module.exports = class AgrariumList {
    constructor(options = {}) {
        this.hook = options.hook || (() => {});
    }
    
    async gather(chunk) {
        this.hook(chunk);
    }
}
