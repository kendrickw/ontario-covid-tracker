import config from 'config';
import express from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import passport from 'passport';

import * as constants from '~/constants';
import Logger from '~/server/logger';

const logger = Logger('auth');
const router = express.Router();
const authEnabled = config.get('auth.enable');

// Authenticate user/password, and then generate a JWT token
// for API authorization
router.post(
  '/login',
  // We don't want to save user in session store
  passport.authenticate('local', { session: false }),
  (req, res) => {
    // credential verified, req.user contains the user information
    // The payload will be returned to all authenticated route via 'req.user'
    const payload: UserT = {
      username: req.user.username,
    };

    if (!authEnabled) {
      res.json(payload);
      return;
    }

    // generate a signed json web token with the contents of
    // user object and return it in the response
    const token = jwt.sign(payload, config.get('auth.jwt.secret'), {
      expiresIn: config.get('auth.jwt.expiry'),
    });
    logger.debug(`${constants.AUTH_TOKEN}:${token}`);

    // calculate JWT cookie expiry
    const expireMs = parseInt(ms(config.get('auth.jwt.expiry')), 10);

    // Save the token in a cookie, httpOnly, so it can only be read
    // on the server side. To prevent XSS attack.
    const secure = config.get('auth.https');
    res.cookie(constants.AUTH_TOKEN, token, {
      secure,
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: expireMs, // Need to be in ms
    });

    res.json(payload);
  }
);

// Logout just clears the JWT cookie
router.post('/logout', (req, res) => {
  res.clearCookie(constants.AUTH_TOKEN);
  res.json({});
});

// Get the authenticated user,
// 401 if not authenticated.
if (authEnabled) {
  router.use('/user', passport.authenticate('jwt', { session: false }));
}
router.get('/user', (req, res) => {
  if (!authEnabled) {
    req.user = { username: 'devuser' };
  }
  res.json(req.user);
});

export default router;
