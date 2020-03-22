import bcrypt from 'bcryptjs';
import config from 'config';
import passport from 'passport';
import passportLocal from 'passport-local';

import * as constants from '~/constants';
import Logger from '~/server/logger';

const logger = Logger('passport-init');

interface VerifyUserT extends UserT {
  pw: string;
}

const authEnabled = config.get('auth.enable');

// This is a mocked user database, for maintaining ID/PW
const userdb = {
  kendrick: {
    // PW encrypted by:
    // bcrypt.hashSync('kendrick'.trim(), 10);
    pw: '$2a$10$mLgG5.Wd18Hd7emePqQzDu0ToNuMKTt25qtd2l64qsYMSzq95dWSG',
  },
};

/**
 * Find user with username
 * @param username
 */
function findUserByName(username: string): Promise<VerifyUserT | null> {
  return new Promise((resolve, reject) => {
    if (!authEnabled) {
      // Return a fake user when authentication is disabled.
      return resolve({ username: 'devuser', pw: 'devuser' });
    }
    if (userdb.hasOwnProperty(username)) {
      const { pw } = userdb[username];
      return resolve({ username, pw });
    }
    resolve(null);
  });
}

// Verify Callback
const verifyUser: passportLocal.VerifyFunction = (username, password, done) => {
  findUserByName(username)
    .then((verifyUserInfo) => {
      logger.warn(`(${username}) verify credential`);
      if (!verifyUserInfo) {
        // Unrecognized username
        logger.warn(`(${username}) Unrecognized username`);
        return done(null, false);
      }

      const { pw, ...user } = verifyUserInfo;

      if (!authEnabled) {
        // return verified user
        done(null, user);
      }

      // Proceed with password verification
      const passwordMatch = bcrypt.compareSync(password.trim(), pw);
      if (!passwordMatch) {
        logger.warn(`(${username}) Incorrect password entered`);
        done(null, false);
        return;
      }
      done(null, user);
    })
    .catch(done);
};

// Setup passport to use local strategy
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(verifyUser));

// Sample auth middleware
// passport.authenticate('local', { session: false })
