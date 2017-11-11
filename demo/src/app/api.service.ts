import {Configuration, DefaultHeaders, NgxOAuthClient} from './component-symlink';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

@Configuration(environment.api)
@DefaultHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
})
export class ApiService extends NgxOAuthClient {
2
  /**
   *
   * @param {NgxRequest} request
   * @returns {any}
   */
  requestInterceptor(request) {
    const token = this.fetchToken('access_token');
    if (token) {
      return request.setHeaders({Authorization: 'Bearer ' + token});
    }

    return request;
  }

  /**
   *
   * @param request
   * @param error
   * @returns {Observable<any>}
   */
  errorInterceptor(request, error): Observable<any> {
    if (error.status === 401) {
      const refresh_token = this.fetchToken('refresh_token');
      if (!refresh_token) {
        return Observable.throw(error);
      }
      return this.getToken('refresh_token', {refresh_token}).switchMap(token => {
        localStorage.setItem('auth_token', JSON.stringify(token));
        return this.getClient().request(
          request.method,
          request.url,
          this.requestInterceptor(request.setHeaders({Authorization: 'Bearer ' + token}))
        );
      });
    }
    return Observable.throw(error);
  }

}
