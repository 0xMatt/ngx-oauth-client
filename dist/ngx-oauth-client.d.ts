import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { NgxOAuthConfig } from './config-interface';
export declare abstract class NgxOAuthClient {
    protected http: Http;
    protected headers: Headers;
    protected config: NgxOAuthConfig;
    /**
     *
     * @param http
     */
    constructor(http: Http);
    getConfig(): any;
    getDefaultHeaders(): any;
    /**
     *
     * @param endpoint
     * @param query
     * @returns {Observable<any>}
     */
    get(endpoint: string, query?: any): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    post(endpoint: string, data: Object, options?: Object): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    put(endpoint: string, data: Object, options?: Object): Observable<any>;
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    delete(endpoint: string, data?: Object, options?: Object): Observable<any>;
    /**
     *
     * @param options
     */
    requestInterceptor(options: RequestOptions): any;
    /**
     * @param res
     * @return {Response}
     */
    responseInterceptor(res: Response): any;
    /**
     *
     * @param error
     * @returns {ErrorObservable<any>}
     */
    errorInterceptor(error: any): ErrorObservable;
    /**
     * Uses formtype to comply with the OAuth2.0 Spec, this will not change
     *
     * @param data
     * @param grant_type
     * @returns {Observable<Response>}
     */
    getToken(data: any, grant_type?: string): Observable<Response>;
    /**
     *
     * @param method
     * @param endpoint
     * @param data
     * @param options
     * @param intercept
     * @returns {Observable<any>}
     */
    protected request(method: string, endpoint: string, data?: any, options?: any, intercept?: boolean): Observable<any>;
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
