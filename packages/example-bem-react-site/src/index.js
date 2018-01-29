import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'b:Page';
import App from 'b:App';

const data = require('./docs/data.json');

ReactDOM.render((
  <Router>
    <Route {...{
      path: '/:lang/:block',
      component: ({ match }) => <App {...{
        lang: match.params.lang,
        langs: data.i18n.langs,
        block: match.params.block,
        blocks: data.blocks,
        page: data.pages[match.params.block]
      }}/>
    }}/>
  </Router>
), document.getElementById('root'));
