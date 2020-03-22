import { ObjectId } from 'mongodb';

import { OntarioCase } from '~/graphql/generated/server';
import { CollectionName, ID, MongoCollection } from './mongo-collection';

// Mongo version of the entry
export type MOntarioCase = Omit<OntarioCase, '_id' | '__typename'> & {
  _id: ObjectId;
};

export default class MongoOntarioCase extends MongoCollection<
  OntarioCase,
  MOntarioCase
> {
  constructor() {
    super(CollectionName.OntarioCase);
  }

  getIdentity = (id: ID): OntarioCase => {
    return { _id: id };
  };
}
