import config from 'config';
import { Db, Logger, MongoClient } from 'mongodb';

import CustomLogger from '~/server/logger';

const logger = CustomLogger('mongo-connector');

export default class MongoConnector {
  private static startLog() {
    const logEnabled = config.get('mongo.logger');

    if (!logEnabled) {
      return;
    }
    let logCount = 0;
    Logger.setCurrentLogger((msg, state) => {
      logger.debug(`MONGO DB REQUEST ${++logCount}: ${msg}`);
    });
    Logger.setLevel('debug');
    Logger.filter('class', ['Cursor']);
  }

  connection: Promise<MongoClient>;
  db: Promise<Db>;

  constructor() {
    const mongoUrl =
      process.env.NODE_ENV === 'test' && process.env.MONGO_URL
        ? process.env.MONGO_URL
        : config.get('mongo.url');
    const dbName = config.get('mongo.db');
    this.connection = MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    MongoConnector.startLog();

    this.db = this.connection
      .then((client) => client.db(dbName))
      .catch((err) => {
        logger.error(err, 'Did you forget to start mongod?');
        return Promise.reject(err);
      });
  }

  async closeConnection() {
    const client = await this.connection;
    client.close();
  }

  async getDb() {
    return this.db;
  }
}
