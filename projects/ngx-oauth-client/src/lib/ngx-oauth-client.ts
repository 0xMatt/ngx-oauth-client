import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/skip';
import {NgxOAuthResponse} from './ngx-oauth-response';
import { Observable } from 'rxjs';
import { NgxOAuthConfig } from './ngx-oauth-config';
import { NgxRequest } from './ngx-oauth-request';
import 'rxjs-compat/add/operator/map';

@Injectable()
export abstract class NgxOAuthClient{

  /**
   * @param http The http client
   */
  protected http: HttpClient;

  /**
   *
   * @param http The http client
   */
  constructor(http: HttpClient) {
    this.http = http;
  }

  getConfig(): any {
  }

  getDefaultHeaders(): any {
  }

  /**
   *
   * @param request The NgxRequest
 whatever
   */
  requestInterceptor(request) {
    return request;
  }

  /**
   *
   * @param request
   * @param response

   */
  responseInterceptor(request, response) {
    return response;
  }

  /**
   *
   * @param request
   * @param error

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
   */
  get(endpoint: string, query?: any, options?: any): Observable<any> {
    return this.request('GET', endpoint, query, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   */
  post(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('POST', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   */
  put(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   */
  patch(endpoint: string, data: any, options?: Object): Observable<any> {
    return this.request('PATCH', endpoint, data, options);
  }

  /**
   *
   * @param endpoint
   * @param data
   * @param options
   */
  delete(endpoint: string, options?: Object): Observable<any> {
    return this.request('delete', endpoint, {}, options);
  }

  /**
   * Uses formtype to comply with the OAuth2.0 Spec, this will not change
   *
   * @param data
   * @param grant_type
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

  fetchToken(key?: string): any {

    const token = localStorage.getItem(this.fetchStorageName());
    if (token) {
      const parsedToken = JSON.parse(token);
      if (key && parsedToken.hasOwnProperty(key)) {
        return parsedToken[key];
      } else if (!key) {
        return parsedToken;
      }
    }

    return null;
  }


  clearToken() {
    localStorage.removeItem(this.fetchStorageName());
  }

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


  protected fetchOption(options, option, fallback: any = null) {
    if (options && typeof options[option] !== 'undefined') {
      return options[option];
    }
    return this.fetchConfig(option, fallback);
  }


  protected fetchConfig(key, fallback: any = null) {
    if (typeof this.getConfig()[key] !== 'undefined') {
      return this.getConfig()[key];
    }
    return fallback;
  }


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
 * @param config - API confiugration
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
 * @param headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: any) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getDefaultHeaders = function () {
      return headers;
    };
    return Target;
  };
}
