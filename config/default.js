// NOTE: all expiry or time related fields should be
// expressed in seconds or a string describing a time span (see npm package: zeit/ms).
//   Eg: 60, "2 days", "10h", "7d".
// A numeric value is interpreted as a seconds count.
module.exports = {
  app: {
    // HTML title
    title: 'COVID-19 Tracker',
    // Port where the server is listening on.
    port: 3000,
  },
  // Mongo DB parameters
  mongo: {
    url: 'mongodb://localhost:27017/',
    db: 'covid',
    logger: false,
  },
  auth: {
    enable: false, // Enable authentication
    https: true, // Use https?  (For setting cookie)
    // Supported authentication strategy:
    //  local: check user/pw against local user db
    //  google: use google oauth2.0 authentication
    stratgey: 'local',
    jwt: {
      // This can be any random string, used for signing JWT token
      secret: '2zVL#EVBbcFk%f7',
      // This controls how long a user can stay authenticated after logging in.
      // i.e. refreshing browser doesn't require a re-login.
      expiry: '1d',
    },
    // A CSRF token is created to prevent Cross Site Request Forgery
    // This is important because the JWT token is placed in a secure cookie.
    // Note that CSRF checked is ignored for ['GET', 'HEAD', 'OPTIONS']
    csrf: {
      // This controls how long a session can last before needing to refresh browser
      expiry: '1d',
    },
  },
};
