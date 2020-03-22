import express from 'express';
import { oc } from 'ts-optchain';

import Mongo, { LoadersT } from '~/graphql/mongo';

export interface ExpressContext {
  req: express.Request;
  res: express.Response;
}

// Apollo Context
export interface Context {
  user: UserT;
  loaders: LoadersT;
}

const context = (expressContext?: ExpressContext): Context => {
  return {
    // user provided by the authentication layer
    user: oc(expressContext).req.user(),

    // Setup dataloaders for graphQL
    loaders: {
      OntarioCase: Mongo.ontarioCase().dataLoader(),
    },

    // Other authorization logic should be provided here
  };
};

export default context;
