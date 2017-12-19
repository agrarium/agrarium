import { decl } from 'bem-react-core';

/**
 * Description on touch level
 *
 * @type {TestBlock}
 */
export default decl({
    block: 'TestBlock',

    willInit() {
        this.__base(...arguments);
        this._onTouchStart = this._onTouchStart.bind(this);
    },

    attrs({ mods, type }) {
        return {
            ...this.__base(...arguments),
            onTouchStart: this._onTouchStart
        };
    },

    _onTouchStart() {
        this.onTouchStart();
    }
}, {
    defaultProps: {
        onTouchStart() {}
    }
});
