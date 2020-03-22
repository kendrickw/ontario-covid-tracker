import DataLoader from 'dataloader';
import { Collection, ObjectId } from 'mongodb';

import { Context } from '~/server/util/apollo-context';
import { Scalars } from '../generated/server';
import MongoConnector from './mongo-connector';

import CustomLogger from '~/server/logger';

const logger = CustomLogger('mongo-collection');

export type ID = Scalars['ID'];
export type IDList = Array<Scalars['ID']>;

// When adding new collection name, the enum name and value must be identical
export enum CollectionName {
  OntarioCase = 'OntarioCase',
}

interface BaseMongoT {
  _id: ObjectId;
}

/**
 * A helper class for exposing common mongo operation on a collection
 *
 * @template T Apollo type representing each document within collection
 * @template MongoT Mongo type representing each document within collection
 */
export abstract class MongoCollection<T, MongoT extends BaseMongoT> {
  mongoConnection: MongoConnector;
  collectionName: CollectionName;
  collection: Promise<Collection<MongoT>>;

  constructor(collectionName: CollectionName) {
    this.mongoConnection = new MongoConnector();
    this.collectionName = collectionName;
    this.collection = this.mongoConnection
      .getDb()
      .then((db) => db.collection<MongoT>(collectionName))
      .catch((err) => {
        logger.error(err, 'Did you specify the correct collectionName?');
        return Promise.reject(err);
      });
  }

  /**
   * Get an identity for propagating resolver.
   *
   * @example
   *    const a = getIdentity('abc');
   *    expect(a).toEqual({ _id: 'abc' });
   */
  abstract getIdentity(id: ID): T;

  /**
   * Get an identity list for propagating resolver
   *
   * @param idList array of IDs
   * @param begin Zero-based index at which to begin extraction
   * @param end Zero-based index before which to end extraction
   * @example
   *   [{ _id: 'abc' }, { _id: 'def'}]
   */
  getIdentityList = (
    idList: IDList,
    begin?: number | null,
    end?: number | null
  ): T[] => {
    if (!idList) {
      return [];
    }
    return idList
      .slice(begin || undefined, end || undefined)
      .map(this.getIdentity);
  };

  /**
   * Produce a batch data loader.
   *   @example
   *   const getCase = dataLoader('Case');
   *   getCase.load("abc");  // equivalent to findOne({ _id: "abc"})
   */
  dataLoader() {
    const batchProcessor = async (ids: Readonly<IDList>) => {
      // TODO: Had to cast away MongoT to BaseMongoT to make typescript
      // type check happy.. Should figure out why.
      const col: Collection<BaseMongoT> = (await this.collection) as any;
      const objectIds = ids.map((id) => new ObjectId(id));
      const result = await col.find({ _id: { $in: objectIds } }).toArray();
      // Mongo *might* re-order the results so that they don't follow the order of the objectIds
      // dataLoader needs the result to be in same order
      return objectIds.map((id) => result.find(({ _id }) => _id.equals(id))!);
    };
    return new DataLoader(batchProcessor);
  }

  /**
   * Get a specific property in a document entry.  If property
   * is not supplied, it returns the identity object.
   *
   * @param loader get document property loader
   * @param id ID of document entry
   * @param property property of document entry
   */
  getProperty = async (context: Context, id: ID, property: any) => {
    if (!id) {
      return null;
    }
    const loader = context.loaders[this.collectionName];
    const entry = await loader.load(id);
    if (!entry) {
      return null;
    }

    return entry[property];
  };
}
