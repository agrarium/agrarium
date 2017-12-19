import { decl } from 'bem-react-core';

/**
 * Simple block description
 *
 * @type {TestBlock2}
 */
export default decl({
    block: 'TestBlock2',
    tag: 'span',

    style({ color }) {
        return { color };
    },
});
