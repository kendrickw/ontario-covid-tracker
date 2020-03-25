import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ErrorPage from '~/components/view/error-page';
import Login from '~/components/view/login';
import Map from '~/components/view/map';
import Table from '~/components/view/table';
import ErrorBoundary from './error-boundary';

// CSS should be loaded in specific orders
// tslint:disable ordered-imports
import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './app.scss';

import withAuth from './with-auth';

const App = () => (
  <ErrorBoundary>
    <Switch>
      <Route path="/" exact render={(props) => <Redirect to="/table" />} />
      <Route path="/login" component={Login} />
      <Route path="/map" component={withAuth('map', Map)} />
      <Route path="/table" component={withAuth('table', Table)} />
      <Route component={ErrorPage} />
    </Switch>
  </ErrorBoundary>
);

export default App;
