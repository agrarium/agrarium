import { decl } from 'bem-react-core';

/**
 * Блок для тестироания доументации
 *
 * @type {TestBlock}
 */
export default decl({
    block: 'TestBlock',
    tag: 'span',

    attrs({ mods, type }) {
        return {
            onClick: this._onClick
        };
    },

    content({ prop1, prop2, prop3 }) {
        return (
            <Bem className={prop1}/>
        );
    },

    willInit() {
        this._onClick = this._onClick.bind(this);
    },

    _onClick() {
        this.onClick();
    }
}, {
    defaultProps: {
        onClick() {}
    }
});
