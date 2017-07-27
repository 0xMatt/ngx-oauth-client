import { Observable } from 'rxjs/Observable';
import { NgxOAuthConfig } from './config-interface';
import { HttpClient, HttpHandler } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/skip';
export declare abstract class NgxOAuthClient {
    private http;
    private handler;
    protected config: NgxOAuthConfig;
    protected token: any;
    /**
     *
     * @param {HttpClient} http
     * @param {HttpHandler} handler
     */
    constructor(http: HttpClient, handler: HttpHandler);
    getConfig(): any;
    getDefaultHeaders(): any;
    /**
     *
     * @param {HttpRequest<any>} request
     * @returns {HttpRequest<any>}
     */
    requestInterceptor(request: any): any;
    responseInterceptor(request: any, response: any): any;
    errorInterceptor(request: any, error: any): any;
    getClient(): HttpClient;
    /**
     *
     * @param endpoint
     * @param query
     * @param options
     * @returns {Observable<any>}
     */
    get(endpoint: string, query?: any, options?: any): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    post(endpoint: string, data: any, options?: Object): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    put(endpoint: string, data: any, options?: Object): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    patch(endpoint: string, data: any, options?: Object): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    delete(endpoint: string, options?: Object): Observable<any>;
    /**
     * Uses formtype to comply with the OAuth2.0 Spec, this will not change
     *
     * @param data
     * @param grant_type
     * @returns {Observable<any>}
     */
    getToken(grant_type?: string, data?: any): Observable<any>;
    /**
     *
     * @param {string} key
     * @returns {any}
     */
    fetchToken(key?: string): any;
    /**
     * Performs an HTTP request
     *
     * @param {string} method
     * @param {string} endpoint
     * @param payload
     * @param options
     * @returns {Observable<any>}
     */
    protected request(method: any, endpoint: string, payload: any, options: any): any;
    /**
     * Fetch options and fallback to config defaults
     * @param options
     * @param option
     * @param fallback
     * @returns {any}
     */
    protected fetchOption(options: any, option: any, fallback?: any): any;
    /**
     *
     * @param key
     * @param fallback
     * @returns {any}
     */
    protected fetchConfig(key: any, fallback?: any): any;
    /**
     *
     * @param endpoint
     * @returns {string}
     */
    protected buildEndpoint(endpoint: string): string;
}
/**
 * Set the base URL of REST resource
 * @param {Object} config - API confiugration
 */
export declare function Configuration(config: NgxOAuthConfig): <TFunction extends Function>(Target: TFunction) => TFunction;
/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export declare function DefaultHeaders(headers: any): <TFunction extends Function>(Target: TFunction) => TFunction;
