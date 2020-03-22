import qs from 'qs';

import { ApiSuccess, callApi } from './svc-util';

export default class AuthSvc {
  static login(data: LoginT) {
    const config = {
      method: 'post',
      url: '/auth/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(data),
    };
    const success: ApiSuccess<UserT> = (response) => response.data;

    return callApi(config, success);
  }

  static logout() {
    const config = {
      method: 'post',
      url: '/auth/logout',
    };
    const success: ApiSuccess<void> = (response) => {
      return;
    };

    return callApi(config, success);
  }

  static getAuthenticatedUser() {
    const config = {
      method: 'get',
      url: '/auth/user',
    };
    const success: ApiSuccess<UserT> = (response) => response.data;

    return callApi(config, success);
  }
}
