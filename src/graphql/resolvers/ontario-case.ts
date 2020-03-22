import Mongo from '~/graphql/mongo';
import Logger from '~/server/logger';
import { Context } from '~/server/util/apollo-context';
import { Resolvers } from '../generated/server';

const logger = Logger('resolvers/cases');

async function getOntarioCases() {
  const { collection, getIdentity } = Mongo.ontarioCase();
  const col = await collection;
  const result = await col
    .find({})
    .project({ _id: 1 })
    .toArray();

  return result.map(({ _id }) => {
    if (!_id) {
      throw new Error('getAllCaseInfo: returned undefined _id');
    }
    return getIdentity(_id.toHexString());
  });
}

export const query: Resolvers['Query'] = {
  ontarioCases: () => getOntarioCases(),
};

export const resolver: Resolvers<Context>['OntarioCase'] = {
  date: async ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'date'),
  caseNo: ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'caseNo'),
  patient: ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'patient'),
  location: ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'location'),
  transmission: ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'transmission'),
  status: ({ _id }, args, context) =>
    Mongo.ontarioCase().getProperty(context, _id, 'status'),
};
