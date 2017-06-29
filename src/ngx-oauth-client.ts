import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {NgxOAuthConfig} from './config-interface';

@Injectable()
export abstract class NgxOAuthClient {

  protected http: Http;
  protected headers: Headers;
  protected config: NgxOAuthConfig;

  /**
   *
   * @param http
   */
  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
  }

  getConfig(): any {
  }

  getDefaultHeaders(): any {
  }

  /**
   *
   * @param endpoint
   * @param query
   * @returns {Observable<any>}
   */
  get(endpoint: string, query?: any): Observable<any> {
    return this.request('get', endpoint, query);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  post(endpoint: string, data: Object, options?: Object): Observable<any> {
    return this.request('post', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  put(endpoint: string, data: Object, options?: Object): Observable<any> {
    return this.request('put', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  delete(endpoint: string, data?: Object, options?: Object): Observable<any> {
    return this.request('delete', endpoint, data, options);
  }

  /**
   *
   * @param options
   */
  requestInterceptor(options: RequestOptions): any {
    return options;
  }

  /**
   * @param res
   * @return {Response}
   */
  responseInterceptor(res: Response): any {
    return res;
  }

  /**
   *
   * @param error
   * @returns {ErrorObservable<any>}
   */
  errorInterceptor(error: any): ErrorObservable {
    return Observable.throw(error);
  }

  /**
   * Uses formtype to comply with the OAuth2.0 Spec, this will not change
   *
   * @param data
   * @param grant_type
   * @returns {Observable<Response>}
   */
  public getToken(data: any, grant_type?: string): Observable<Response> {
    const config = this.getConfig();
    const grant = grant_type || 'password';

    Object.assign(data, {
      grant_type: grant,
      client_id: config.key,
      client_secret: config.secret,
    });

    const opts = new RequestOptions({
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
    });

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('grant_type', grant);
    if (grant === 'password') {
      urlSearchParams.append('username', data.username);
      urlSearchParams.append('password', data.password);
    }
    if (grant === 'refresh_token') {
      urlSearchParams.append('refresh_token', data.refresh_token);
    }

    if (config.key && config.secret) {
      urlSearchParams.append('client_id', config.key);
      urlSearchParams.append('client_secret', config.secret);
    }

    const body = urlSearchParams.toString();

    return this.http.post(config.host + '/' + config.token, body, opts)
      .map(this.responseInterceptor.bind(this))
      .catch(this.errorInterceptor.bind(this));
  }

  /**
   *
   * @param method
   * @param endpoint
   * @param data
   * @param options
   * @param intercept
   * @returns {Observable<any>}
   */
  protected request(method: string, endpoint: string, data?: any, options?: any, intercept?: boolean): Observable<any> {

    const opts = new RequestOptions(Object.assign({headers: this.getDefaultHeaders()}, options));
    intercept = intercept || true;

    if (method === 'get') {
      const params: URLSearchParams = new URLSearchParams();
      if (data) {
        for (const key in data) {
          if (data[key]) {
            params.set(key, data[key]);
          }
        }
        opts.search = params;
      }

      data = opts;
    }

    if (intercept === true) {
      this.requestInterceptor(opts);
    }

    return this.http[method](this.buildEndpoint(endpoint), data || {}, opts)
      .map(this.responseInterceptor.bind(this))
      .catch(this.errorInterceptor.bind(this));
  }

  /**
   *
   * @param endpoint
   * @returns {string}
   */
  protected buildEndpoint(endpoint: string): string {

    if (!endpoint) {
      throw new Error('Endpoint cannot be empty!');
    }

    if (endpoint.charAt(0) === '/') {
      endpoint = endpoint.substr(1);
    }

    return this.getConfig().host.replace(/\/$/, '') + '/' + endpoint;
  }
}


/**
 * Set the base URL of REST resource
 * @param {Object} config - API confiugration
 */
export function Configuration(config: NgxOAuthConfig) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getConfig = function (): NgxOAuthConfig {
      return config;
    };
    return Target;
  };
}

/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: any) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getDefaultHeaders = function () {
      return headers;
    };
    return Target;
  };
}
