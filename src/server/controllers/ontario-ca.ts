import express from 'express';

import Logger from '~/server/logger';
import readOntarioCa from '../cron-jobs/read-ontario-ca';

const route = express.Router();
const logger = Logger('ontario-ca');

/**
 * process table displayed in https://www.ontario.ca/page/2019-novel-coronavirus
 * and upload the result into database
 *
 */
route.post('/process-page', async (req, res, next) => {
  const result = await readOntarioCa();

  res.json(result);
});

export default route;
