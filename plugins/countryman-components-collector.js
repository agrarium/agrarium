module.exports = class CountrymanComponentsCollector {
    constructor(settings) {
        
    }

    async seed({ key }, ctx) {
        ctx.components = ctx.components || [];
        ctx.components.push(key);
    }
}
