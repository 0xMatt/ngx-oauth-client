import {HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';

export class NgxRequest {

  method;
  url;
  body: any;
  headers: HttpHeaders;
  params: HttpParams;
  observe: false;
  reportProgress?: boolean;
  responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials: boolean;

  constructor(method, url) {
    this.method = method;
    this.url = url;
  }

  setHeaders(headers: {
    [name: string]: string | string[];
  }, override?: {
    [name: string]: string | string[];
  }): NgxRequest {
    this.headers = new HttpHeaders(Object.assign(headers, override));
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  setObserve(type): NgxRequest {
    this.observe = type;
    return this;
  }

  setParams(params): NgxRequest {
    this.params = new HttpParams();
    for (const key in params) {
      if (typeof params === 'object' && params.hasOwnProperty(key)) {
        this.params.set(key, key[params]);
      }
    }
    return this;
  }

  setReportProgress(value: boolean): NgxRequest {
    this.reportProgress = value;
    return this;
  }

  setResponseType(type): NgxRequest {
    this.responseType = type;
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {NgxRequest}
   */
  setWithCredentials(value: boolean): NgxRequest {
    this.withCredentials = value;
    return this;
  }
}
