import config from 'config';
import express from 'express';
import passport from 'passport';

const authEnabled = config.get('auth.enable');
const api = express.Router();

/**
 * This is an authentication middleware to protect any
 * endpoint
 */
if (authEnabled) {
  api.use('*', passport.authenticate('jwt', { session: false }));
} else {
  // Inject the fake user in the request
  api.use('*', (req, res, next) => {
    req.user = { username: 'devuser' };
    next();
  });
}

export default api;
