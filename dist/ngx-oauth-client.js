"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/Rx");
var NgxOAuthClient = (function () {
    /**
     *
     * @param http
     */
    function NgxOAuthClient(http) {
        this.http = http;
        this.headers = new http_1.Headers();
    }
    NgxOAuthClient.prototype.getConfig = function () {
    };
    NgxOAuthClient.prototype.getDefaultHeaders = function () {
    };
    /**
     *
     * @param endpoint
     * @param query
     * @returns {Observable<any>}
     */
    NgxOAuthClient.prototype.get = function (endpoint, query) {
        return this.request('get', endpoint, query);
    };
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    NgxOAuthClient.prototype.post = function (endpoint, data, options) {
        return this.request('post', endpoint, data, options);
    };
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    NgxOAuthClient.prototype.put = function (endpoint, data, options) {
        return this.request('put', endpoint, data, options);
    };
    /**
     *
     * @param endpoint
     * @param data
     * @param options
     * @returns {Observable<any>}
     */
    NgxOAuthClient.prototype.delete = function (endpoint, data, options) {
        return this.request('delete', endpoint, data, options);
    };
    /**
     *
     * @param options
     */
    NgxOAuthClient.prototype.requestInterceptor = function (options) {
        return options;
    };
    /**
     * @param res
     * @return {Response}
     */
    NgxOAuthClient.prototype.responseInterceptor = function (res) {
        return res;
    };
    /**
     *
     * @param error
     * @returns {ErrorObservable<any>}
     */
    NgxOAuthClient.prototype.errorInterceptor = function (error) {
        return Observable_1.Observable.throw(error);
    };
    /**
     * Uses formtype to comply with the OAuth2.0 Spec, this will not change
     *
     * @param data
     * @param grant_type
     * @returns {Observable<Response>}
     */
    NgxOAuthClient.prototype.getToken = function (data, grant_type) {
        var config = this.getConfig();
        var grant = grant_type || 'password';
        Object.assign(data, {
            grant_type: grant,
            client_id: config.key,
            client_secret: config.secret,
        });
        var opts = new http_1.RequestOptions({
            headers: new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        });
        var urlSearchParams = new http_1.URLSearchParams();
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
        var body = urlSearchParams.toString();
        return this.http.post(config.host + '/' + config.token, body, opts)
            .map(this.responseInterceptor)
            .catch(this.errorInterceptor);
    };
    /**
     *
     * @param method
     * @param endpoint
     * @param data
     * @param options
     * @param intercept
     * @returns {Observable<any>}
     */
    NgxOAuthClient.prototype.request = function (method, endpoint, data, options, intercept) {
        var opts = new http_1.RequestOptions(Object.assign({ headers: this.getDefaultHeaders() }, options));
        intercept = intercept || true;
        if (method === 'get') {
            var params = new http_1.URLSearchParams();
            if (data) {
                for (var key in data) {
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
            .map(this.responseInterceptor)
            .catch(this.errorInterceptor);
    };
    /**
     *
     * @param endpoint
     * @returns {string}
     */
    NgxOAuthClient.prototype.buildEndpoint = function (endpoint) {
        if (!endpoint) {
            throw new Error('Endpoint cannot be empty!');
        }
        if (endpoint.charAt(0) === '/') {
            endpoint = endpoint.substr(1);
        }
        return this.getConfig().host.replace(/\/$/, '') + '/' + endpoint;
    };
    return NgxOAuthClient;
}());
NgxOAuthClient.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
NgxOAuthClient.ctorParameters = function () { return [
    { type: http_1.Http, },
]; };
exports.NgxOAuthClient = NgxOAuthClient;
/**
 * Set the base URL of REST resource
 * @param {Object} config - API confiugration
 */
function Configuration(config) {
    return function (Target) {
        Target.prototype.getConfig = function () {
            return config;
        };
        return Target;
    };
}
exports.Configuration = Configuration;
/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
function DefaultHeaders(headers) {
    return function (Target) {
        Target.prototype.getDefaultHeaders = function () {
            return headers;
        };
        return Target;
    };
}
exports.DefaultHeaders = DefaultHeaders;
//# sourceMappingURL=ngx-oauth-client.js.map