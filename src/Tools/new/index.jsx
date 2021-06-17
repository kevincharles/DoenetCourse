import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from '../_framework/NewToolRoot';


ReactDOM.render(
  <RecoilRoot>
    <Router>
      <Switch>
        <Route
          path="/"
          render={(routeprops) => (
            <ToolRoot route={{ ...routeprops }}/>
          )}
        />
      </Switch>
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
