import axios, {
  AxiosError,
  AxiosProxyConfig,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type ApiSuccess<T> = (response: AxiosResponse) => T;
export type ApiFail<T> = (err: AxiosError) => T;

/**
 * axios wrapper so we can have a unify location for handling common
 * error
 *
 * @param config AxiosRequestConfig
 * @param success ApiSuccess<T>
 * @param fail ApiFail<T>
 */
export function callApi<T>(
  config: AxiosRequestConfig,
  success: ApiSuccess<T>,
  fail?: ApiFail<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => {
        const result = success(response);
        resolve(result);
      })
      .catch((err: AxiosError) => {
        if (err.response && err.response.status === 403) {
          // When CSRF token expires, it returns 403
        }
        if (fail) {
          const result = fail(err);
          reject(result);
          return;
        }
        reject(err);
      })
      .catch(reject);
  });
}
