module.exports = class CollectorFarmer {
    constructor(settings) {
        
    }

    async seed({ key }, ctx) {
        ctx.components = ctx.components || [];
        ctx.components.push(key);
    }
}
