import cron from 'node-cron';

import readOntarioCa from './read-ontario-ca';

export default function initCronJobs() {
  cron.schedule('0 11 * * *', readOntarioCa); // 11AM daily
  cron.schedule('0 18 * * *', readOntarioCa); // 6PM daily
}
