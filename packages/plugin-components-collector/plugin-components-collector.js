module.exports = class AgrariumComponentsCollector {
    async seed({ key }, ctx) {
        ctx.components = ctx.components || [];
        ctx.components.push(key);
    }
}
