import { decl } from 'bem-react-core';

export default decl({
  block: 'Markdown',
  attrs({ html }) {
    return {
      dangerouslySetInnerHTML: {
        __html: html
      }
    };
  }
});
