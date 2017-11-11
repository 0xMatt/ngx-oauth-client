"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var NgxRequest = (function () {
    function NgxRequest(method, url) {
        this.method = method;
        this.url = url;
    }
    NgxRequest.prototype.setHeaders = function (headers, override) {
        this.headers = new http_1.HttpHeaders(Object.assign(headers, override));
        return this;
    };
    NgxRequest.prototype.setBody = function (body) {
        this.body = body;
        return this;
    };
    NgxRequest.prototype.setObserve = function (type) {
        this.observe = type;
        return this;
    };
    NgxRequest.prototype.setParams = function (params) {
        var resource = new http_1.HttpParams();
        for (var key in params) {
            if (typeof params === 'object' && params.hasOwnProperty(key)) {
                resource = resource.set(key, params[key]);
            }
        }
        this.params = resource;
        return this;
    };
    NgxRequest.prototype.setHttpParams = function (params) {
        this.params = params;
        return this;
    };
    NgxRequest.prototype.setReportProgress = function (value) {
        this.reportProgress = value;
        return this;
    };
    NgxRequest.prototype.setResponseType = function (type) {
        this.responseType = type;
        return this;
    };
    /**
     *
     * @param {boolean} value
     * @returns {NgxRequest}
     */
    /**
       *
       * @param {boolean} value
       * @returns {NgxRequest}
       */
    NgxRequest.prototype.setWithCredentials = /**
       *
       * @param {boolean} value
       * @returns {NgxRequest}
       */
    function (value) {
        this.withCredentials = value;
        return this;
    };
    return NgxRequest;
}());
exports.NgxRequest = NgxRequest;
//# sourceMappingURL=ngx-request.js.map