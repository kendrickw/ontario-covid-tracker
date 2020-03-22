import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import rootReducer, { rootEpic } from './index';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const configureStore = (preloadedState: any) => {
  const epicMiddleware = createEpicMiddleware();

  const epic$ = new BehaviorSubject(rootEpic);
  // Every time a new epic is given to epic$ it will unsubscribe from the previous one then
  // call and subscribe to the new one because of how switchMap works
  const hotReloadingEpic: Epic<any> = (...args) =>
    epic$.pipe(switchMap((epic) => epic(...args)));

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(hotReloadingEpic);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./index', () => {
      const nextRootReducer = require('./index').default;
      store.replaceReducer(nextRootReducer);

      const nextRootEpic = require('./index').rootEpic;
      epic$.next(nextRootEpic);
    });
  }

  return store;
};

export default configureStore;
