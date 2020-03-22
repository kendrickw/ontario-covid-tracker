// NOTE: Custom environment variables override all
// other configuration files
module.exports = {
  app: {
    // This means process.env.PORT takes precedence if specified
    port: 'PORT',
  },
  auth: {
    enable: 'AUTH_ENABLE',
    jwt: {
      secret: 'AUTH_JWT_SECRET',
    },
  },
  // Mongo DB parameters
  mongo: {
    url: 'MONGODB_CONNECTION_STRING',
  },
};
