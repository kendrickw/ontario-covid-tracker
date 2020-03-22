import { GraphQLDate } from 'graphql-iso-date';

import { Resolvers } from '../generated/server';
import * as ontarioCase from './ontario-case';

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers: Resolvers = {
  GraphQLDate,
  OntarioCase: ontarioCase.resolver,
  Query: {
    ...ontarioCase.query,
  },
  // Mutation: {
  //   ...ontarioCase.mutation,
  // },
};

export default resolvers;
