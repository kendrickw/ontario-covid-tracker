import pino from 'pino';

// Standard set of serializers
// https://github.com/pinojs/pino-std-serializers
export const serializers = pino.stdSerializers;

function errorSerializer(err: Error) {
  const json = serializers.err(err);
  const { stack, ...others } = json;
  if (stack) {
    // tslint:disable no-console
    console.error(stack);
  }
  // parse the stack string and make it into object
  return json;
}

/**
 * Logger for browser component
 */
const logger = pino({
  serializers: {
    err: errorSerializer,
  },
  // Options: https://github.com/pinojs/pino/blob/master/docs/api.md#options
  browser: {
    asObject: true,
    // @ts-ignore: for whatever reason, serialize is not documented in
    // pino's type definition
    serialize: [
      // Uncomment to disable default error object serializer
      // '!stdSerializers.err',
      'err',
    ],
  },

  level: 'trace',
});
const Logger = (src: string) => logger.child({ src });
export default Logger;
