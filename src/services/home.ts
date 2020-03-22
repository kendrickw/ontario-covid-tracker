import { ApiSuccess, callApi } from './svc-util';

export default class HomeSvc {
  static sampleApi(data: object) {
    const config = {
      method: 'post',
      url: '/api/home',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };
    const success: ApiSuccess<object> = (response) => response.data;

    return callApi(config, success);
  }
}
