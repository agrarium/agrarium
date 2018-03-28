import { declMod } from 'bem-react-core';

/**
 * Block's modifier description
 *
 * @type {TestBlock}
 */
export default declMod({ mod: true }, {
    block: 'TestBlock',

    willUnmount() {
        this.onExit();
    }
}, {
    defaultProps: {
        onExit() {}
    }
});
