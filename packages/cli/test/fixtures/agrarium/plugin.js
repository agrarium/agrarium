module.exports = class Test {
    constructor({ field }) {
        this.field = field;

    }

    gather() {
        return { [this.field]: true };
    }
}
