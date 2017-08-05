import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgxOAuthConfig} from './config-interface';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NgxRequest} from './ngx-request';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/skip';
import {NgxOAuthResponse} from './ngx-oauth-response';

@Injectable()
export abstract class NgxOAuthClient {

  protected config: NgxOAuthConfig;

  protected token;

  /**
   *
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
  }

  getConfig(): any {
  }

  getDefaultHeaders(): any {
  }

  /**
   *
   * @param request
   * @returns {any}
   */
  requestInterceptor(request) {
    return request;
  }

  /**
   *
   * @param request
   * @param response
   * @returns {any}
   */
  responseInterceptor(request, response) {
    return response;
  }

  /**
   *
   * @param request
   * @param error
   * @returns {any}
   */
  errorInterceptor(request, error) {
    return error;
  }

  getClient(): HttpClient {
    return this.http;
  }

  /**
   *
   * @param endpoint
   * @param query
   * @param options
   * @returns {Observable<any>}
   */
  get (endpoint: string, query?: any, options?: any): Observable<any> {
    return this.request('GET', endpoint, query, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  post(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('POST', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  put(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  patch(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('PATCH', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   * @returns {Observable<any>}
   */
  delete(endpoint: string, options?: Object): Observable<any> {
    return this.request('delete', endpoint, {}, options);
  }

  /**
   * Uses formtype to comply with the OAuth2.0 Spec, this will not change
   *
   * @param data
   * @param grant_type
   * @returns {Observable<any>}
   */
  public getToken(grant_type?: string, data?: any): Observable<NgxOAuthResponse> {

    if (grant_type && ['client_credentials', 'authorization_code', 'password', 'refresh_token'].indexOf(grant_type) === -1) {
      throw new Error(`Grant type ${grant_type} is not supported`);
    }

    const config = this.getConfig();
    const defaults: any = {
      grant_type: grant_type || 'client_credentials'
    };

    if (this.fetchConfig('key')) {
      defaults.client_id = this.fetchConfig('key');
    }

    if (this.fetchConfig('secret')) {
      defaults.client_secret = this.fetchConfig('secret');
    }

    const payload = Object.assign(defaults, data);
    const params: string[] = [];
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        params.push(`${key}=${payload[key]}`);
      }
    }

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    return this.http.post(config.host + '/' + config.token, params.join('&'), {headers}).map((res: NgxOAuthResponse) => {
      this.setToken(res);
      return res;
    });
  }

  setToken(token: NgxOAuthResponse) {
    localStorage.setItem(this.fetchStorageName(), JSON.stringify(token));
  }

  /**
   *
   * @param {string} key
   * @returns {any}
   */
  fetchToken(key?: string): any {

    const token = localStorage.getItem(this.fetchStorageName());
    if (token) {
      const parsedToken = JSON.parse(token);
      if (key && parsedToken.hasOwnProperty(key)) {
        return parsedToken[key];
      }
      return parsedToken;
    }

    return null;
  }

  /**
   * Performs an HTTP request
   *
   * @param {string} method
   * @param {string} endpoint
   * @param payload
   * @param options
   * @returns {Observable<any>}
   */
  protected request(method, endpoint: string, payload, options): any {
    const request = new NgxRequest(method, this.buildEndpoint(endpoint));
    if (method === 'GET' && payload && Object.keys(payload).length > 0) {
      request.setParams(payload);
    }

    if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
      request.setBody(payload);
    }

    request
      .setHeaders(this.getDefaultHeaders(), options ? options.headers : undefined)
      .setReportProgress(this.fetchOption(options, 'reportProgress', false))
      .setObserve(this.fetchOption(options, 'observe', 'body'))
      .setResponseType(this.fetchOption(options, 'responseType', 'json'))
      .setWithCredentials(this.fetchOption(options, 'withCredentials', false));

    if (options && options.params instanceof HttpParams) {
      request.setHttpParams(options.params);
    }

    return this.http.request(method, this.buildEndpoint(endpoint), this.requestInterceptor(request))
      .map(res => this.responseInterceptor(request, res))
      .catch(err => this.errorInterceptor(request, err));
  }

  /**
   * Fetch options and fallback to config defaults
   * @param options
   * @param option
   * @param fallback
   * @returns {any}
   */
  protected fetchOption(options, option, fallback?) {
    if (options && typeof options[option] !== 'undefined') {
      return options[option];
    }
    return this.fetchConfig(option, fallback);
  }

  /**
   *
   * @param key
   * @param fallback
   * @returns {any}
   */
  protected fetchConfig(key, fallback?) {
    if (typeof this.getConfig()[key] !== 'undefined') {
      return this.getConfig()[key];
    }
    return fallback;
  }

  /**
   * Gets the name of the storage token
   *
   * @returns {string}
   */
  protected fetchStorageName(): string {
    const prefix: string = this.fetchConfig('storage_prefix');
    const suffix = 'auth_token';

    let token = '';
    if (prefix) {
      token += prefix;
    }
    token += suffix;
    return token;
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
