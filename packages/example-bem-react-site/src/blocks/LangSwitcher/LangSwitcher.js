import React from 'react';
import { Link } from 'react-router-dom'
import { decl } from 'bem-react-core';

export default decl({
  block: 'LangSwitcher',
  content({ langs, block }) {
    return langs.map((lang, i) => (
      <Link {...{
        className: 'LangSwitcher-Link',
        to: `/${lang}/${block}`,
        key: `link-${i}`
        }}>{lang}</Link>
    ));
  }
});
