import { ApolloServer } from 'apollo-server-express';

import { schema } from '~/graphql/util/apollo';
import context from './apollo-context';

const server = new ApolloServer({
  schema,
  context,
  // uploads: false,
});

export default server;
