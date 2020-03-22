import { createActionCreator, createReducer } from 'deox';
import {
  ActionsObservable,
  combineEpics,
  Epic,
  ofType,
} from 'redux-observable';
import { empty, from, of } from 'rxjs';
import {
  catchError,
  mapTo,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators';

import authSvc from '~/services/auth';

interface State {
  readonly user: UserT | null;
  readonly msg: string; // log in status
}

const initialState: State = {
  user: null,
  msg: '',
};

const login = createActionCreator(
  'USER/LOGIN',
  (resolve) => (username: string, password: string) =>
    resolve({ username, password })
);
const logout = createActionCreator('USER/LOGOUT');
const set = createActionCreator('USER/SET', (resolve) => (user: UserT | null) =>
  resolve(user)
);
const setMessage = createActionCreator(
  'USER/SET_MESSAGE',
  (resolve) => (msg: string) => resolve(msg)
);

export const userActions = {
  login,
  logout,
  set,
  setMessage,
};

export default createReducer(initialState, (handleAction) => [
  handleAction(set, (state, { payload }) => ({
    ...state,
    user: payload,
  })),
  handleAction(setMessage, (state, { payload }) => ({
    ...state,
    msg: payload,
  })),
  handleAction(login, (state, { payload }) => ({
    ...state,
    msg: 'Logging in...',
  })),
  handleAction(logout, (state) => ({
    ...state,
    success: false,
  })),
]);

export const userEpics: Epic = combineEpics(
  (action$: ActionsObservable<ReturnType<typeof login>>) =>
    action$.pipe(
      ofType('USER/LOGIN'),
      switchMap(({ payload }) =>
        from(authSvc.login(payload!)).pipe(
          mergeMap((user) =>
            of(userActions.set(user), userActions.setMessage(''))
          ),
          catchError((err) =>
            of(userActions.set(null), userActions.setMessage('Login Failed'))
          )
        )
      )
    ),

  (action$: ActionsObservable<ReturnType<typeof logout>>) =>
    action$.pipe(
      ofType('USER/LOGOUT'),
      switchMap(() =>
        from(authSvc.logout()).pipe(
          catchError((err) => empty()), // Ignore any error
          mapTo(userActions.set(null))
        )
      )
    )
);

interface SelectorT {
  user: State;
}
export const userSelectors = {
  getUser: ({ user: state }: SelectorT) => state.user,
  getMsg: ({ user: state }: SelectorT) => state.msg,
};
