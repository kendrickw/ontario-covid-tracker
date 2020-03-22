declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __PRELOADED_STATE__?: object;
  __APOLLO_STATE__?: object;
  __CSRF_TOKEN__: string;
}

// Payload stored in JWT token, returned via req.user
declare interface UserT {
  username: string;
}

// Payload for calling authSvc.login()
declare interface LoginT {
  username: string;
  password: string;
}
