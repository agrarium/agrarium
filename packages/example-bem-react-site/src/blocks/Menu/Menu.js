import React from 'react';
import { Link } from 'react-router-dom'
import { decl } from 'bem-react-core';

export default decl({
  block: 'Menu',
  content({ lang, blocks }) {
    return blocks.map((block, i) => (
      <Link {...{
        className: 'Menu-Link',
        to: `${block}`,
        key: `link-${i}`
        }}>{block}</Link>
    ));
  }
});
