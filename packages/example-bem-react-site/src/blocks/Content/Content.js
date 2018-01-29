import React, { Fragment } from 'react';
import { decl } from 'bem-react-core';

import Markdown from 'b:Markdown';
import Path from 'b:Path';
import Interface from 'b:Interface';

export default decl({
  block: 'Content',
  content({ lang, page }) {
    return (
      <Fragment>
        {page.markdown
            .filter(md => md.lang === lang)
            .map((md, i) => [
              <Markdown {...{
                html: md.content,
                key: `md-${i}`}}/>,
              <Path {...{
                path: md.path,
                key: `path-${i}`
              }}/>
            ])}
        {page.dts
          .map((dts, i) => <Interface {...{
            declaration: dts,
            key: `interface-${i}`
          }}/>)}
      </Fragment>
    )
  }
});
