import config from 'config';
import { Request } from 'express';
import passport from 'passport';
import passportJWT, { JwtFromRequestFunction } from 'passport-jwt';

import * as constants from '~/constants';
import Logger from '~/server/logger';

const logger = Logger('passport-init');

// Setup passport to handle JWT token
const fromCookie = (req: Request) => req.cookies[constants.AUTH_TOKEN];
const JWTStrategy = passportJWT.Strategy;
const jwtConfig = {
  // jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: fromCookie,
  secretOrKey: config.get('auth.jwt.secret'),
};
const verifyJwt: passportJWT.VerifyCallback = (jwt, done) => {
  // Check jwt expiration
  if (typeof jwt.exp !== 'undefined') {
    // Get plain UTC time (since jwt.exp is also the same)
    const current = Date.now().valueOf() / 1000;
    if (jwt.exp < current) {
      // Access Token Expired
      logger.warn('Access Token Expired');
      done(null, false);
      return;
    }
  }
  done(null, jwt);
};
passport.use(new JWTStrategy(jwtConfig, verifyJwt));

// Sample auth middleware
// passport.authenticate('jwt', { session: false })
