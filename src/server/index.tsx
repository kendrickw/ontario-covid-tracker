import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express from 'express';
import boom from 'express-boom';
import morgan from 'morgan';
import ms from 'ms';
import passport from 'passport';
import path from 'path';
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { ServerStyleSheet } from 'styled-components';

import App from '~/client/app';
import html from '~/client/html';
import * as constants from '~/constants';
import { schema } from '~/graphql/util/apollo';
import fragmentMatcher from '~/graphql/util/fragment-matcher';
import configureStore from '~/reducers/configure-store';
import apiRoutes from './api-routes';
import auth from './controllers/auth';
import useAuth from './use-auth';
import apolloServer from './util/apollo-server';

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const authEnabled = config.get('auth.enable');
const staticPath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '..', 'build', 'public')
    : process.env.RAZZLE_PUBLIC_DIR!;

// Avoid using any session objects to keep server stateless
const server = express()
  .disable('x-powered-by')
  .use(express.static(staticPath))
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(passport.initialize())
  .use(boom());

// Setup passport strategies after passport initialization
import './passport-init';

// Add CSRF Token protection
if (authEnabled) {
  // calculate CSRF cookie expiry
  const expireMs = parseInt(ms(config.get('auth.csrf.expiry')), 10);
  const secure = config.get('auth.https');

  server.use(
    csurf({
      cookie: {
        key: constants.CSRF_TOKEN,
        path: '/',
        httpOnly: true,
        secure,
        sameSite: 'Strict',
        maxAge: expireMs / 1000, // Need to be in seconds
      },
    })
  );
}

server
  .use('/auth', auth)
  .use('/api', useAuth, apiRoutes)
  .use('/graphql', useAuth);

// Add graphQL server
apolloServer.applyMiddleware({ app: server });

// React pages
server.get('/*', (req, res) => {
  const context = {};

  // Compile an initial state
  const preloadedState = {};

  // Create a new Redux store instance
  const store = configureStore(preloadedState);

  // SSR styled-components
  const sheet = new ServerStyleSheet();

  // SSR apollo-client
  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache({ fragmentMatcher }),
  });

  const Body = (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          {sheet.collectStyles(<App />)}
        </StaticRouter>
      </Provider>
    </ApolloProvider>
  );

  getDataFromTree(Body).then(() => {
    // We are ready to render for real
    const body = renderToString(Body);

    // Grab styles
    const styles = sheet.getStyleTags();

    // Grab the initial state from our Redux store
    const reduxState = store.getState();

    // Grab apollo client state
    const apolloState = client.extract();

    res.send(
      html({
        css: assets.client.css,
        js: assets.client.js,
        title: config.get('app.title'),
        styles,
        body,
        csrf: authEnabled && serialize(req.csrfToken()),
        reduxState: serialize(reduxState),
        apolloState: serialize(apolloState),
      })
    );
  });
});

export default server;
