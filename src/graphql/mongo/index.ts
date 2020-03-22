import DataLoader from 'dataloader';

import MongoOntarioCase, { MOntarioCase } from './mongo-ontario-case';
export { CollectionName } from './mongo-collection';

export interface LoadersT {
  OntarioCase: DataLoader<string, MOntarioCase>;
}

class Mongo {
  private mongoOntarioCase?: MongoOntarioCase;

  ontarioCase() {
    if (!this.mongoOntarioCase) {
      this.mongoOntarioCase = new MongoOntarioCase();
    }
    return this.mongoOntarioCase;
  }
}

export default new Mongo();
