import { ApolloProvider } from '@apollo/react-hooks';
import axiosFetch from '@lifeomic/axios-fetch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import axios from 'axios';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import fragmentMatcher from '../graphql/util/fragment-matcher';
import configureStore from '../reducers/configure-store';
import App from './app';

// Set Axios default
if (window.__CSRF_TOKEN__) {
  axios.defaults.headers.common['X-CSRF-Token'] = window.__CSRF_TOKEN__;
}
axios.defaults.headers.common['cache-control'] = 'no-cache';
axios.defaults.headers.common.Accept = 'application/json';
// Whether or not cross-site Access-Control requests should be made using credentials
// axios.defaults.withCredentials = true;

const client = new ApolloClient({
  cache: new InMemoryCache({ fragmentMatcher }).restore(
    window.__APOLLO_STATE__ as any
  ),
  link: createHttpLink({
    uri: '/graphql',
    fetch: axiosFetch.buildAxiosFetch(axios),
  }),
});

const store = configureStore(window.__PRELOADED_STATE__);

hydrate(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./app', () => {
    hydrate(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
      document.getElementById('root')
    );
  });
}
