import config from 'config';
import express from 'express';

import initCronJobs from '~/server/cron-jobs';
import Logger from '~/server/logger';

const logger = Logger('src/index');

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', () => {
    logger.debug('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      logger.error(error);
    }
  });
  logger.debug('✅  Server-side HMR Enabled!');
}

const port = config.get('app.port');

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, (err: Error) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info(`> Started on port ${port}`);
  });

// Start cron jobs
initCronJobs();
