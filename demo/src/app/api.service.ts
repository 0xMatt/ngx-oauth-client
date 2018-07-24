import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Configuration, DefaultHeaders, NgxOAuthClient } from './component-symlink';

@Configuration(environment.api)
@DefaultHeaders({
  'Content-Type': 'application/json',
  'Accept':       'application/json'
})
export class ApiService extends NgxOAuthClient {

  /**
   *
   * @param {NgxRequest} request
   * @returns {any}
   */
  requestInterceptor(request) {
    const token = this.fetchToken('access_token');
    if (token) {
      return request.setHeaders({ Authorization: 'Bearer ' + token });
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
        return throwError(error);
      }
      return this.getToken('refresh_token', { refresh_token }).pipe(
        switchMap(token => {
          localStorage.setItem('auth_token', JSON.stringify(token));
          return this.getClient().request(
            request.method,
            request.url,
            this.requestInterceptor(request.setHeaders({ Authorization: 'Bearer ' + token }))
          );
        })
      );
    }
    return Observable.throw(error);
  }

}
