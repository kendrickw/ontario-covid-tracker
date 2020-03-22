import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import user, { userActions, userEpics, userSelectors } from './user';

// workaround to combineReducers typing issue:
// https://github.com/reduxjs/redux/issues/2709
export default combineReducers({
  user,
});

export const rootEpic = combineEpics(userEpics);

// Aggregate list of actions
export const actions = {
  userActions,
};

// Aggregate list of selectors
export const selectors = {
  userSelectors,
};
