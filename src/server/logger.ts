import pino from 'pino';
const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  // Options: https://github.com/pinojs/pino/blob/master/docs/api.md#options
  level: 'trace',
  prettyPrint: isProduction
    ? false
    : {
        // Options: https://github.com/pinojs/pino-pretty#options
        translateTime: true,
      },
});
const Logger = (src: string) => logger.child({ src });
export default Logger;
