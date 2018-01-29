import React, { Fragment } from 'react';
import { decl } from 'bem-react-core';

import Content from 'b:Content';
import Menu from 'b:Menu';
import LangSwitcher from 'b:LangSwitcher';

export default decl({
  block: 'App',
  content({ lang, langs, block, blocks, page }) {
    return (
      <Fragment>
        <LangSwitcher {...{ langs, block }}/>
        <Menu {...{ lang, blocks }}/>
        <Content {...{ lang, page }}/>
      </Fragment>
    );
  }
});
