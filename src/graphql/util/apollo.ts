import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from '~/graphql/resolvers';
import Logger from '~/server/logger';
import { Context } from '~/server/util/apollo-context';
import fragmentMatcher from './fragment-matcher';

const logger = Logger('apollo-util');

const typeDefs = importSchema('src/graphql/schema.graphql');

// GRAPHQL schema and resolvers
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers as any,
  logger: {
    log: logger.debug as any,
  },

  // Since we are generating the Fragment Matchers automatically for the union/interface
  // types, we don't need resolvers for resolveTypes
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

// Apollo Client for making graphQL request in resolver
export function createApolloClient(context: Context) {
  const schemaLink = new SchemaLink({
    schema,
    context,
  });

  return new ApolloClient({
    ssrMode: true,
    link: schemaLink,
    cache: new InMemoryCache({ fragmentMatcher }),
  });
}
