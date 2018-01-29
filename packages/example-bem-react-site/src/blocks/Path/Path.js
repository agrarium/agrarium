import { decl } from 'bem-react-core';

export default decl({
  block: 'Path',
  tag: 'code',
  content({ path }) {
    return path;
  }
});
