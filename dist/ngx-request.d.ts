import { HttpHeaders, HttpParams } from '@angular/common/http';
export declare class NgxRequest {
    method: any;
    url: any;
    body: any;
    headers: HttpHeaders;
    params: HttpParams;
    observe: false;
    reportProgress?: boolean;
    responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials: boolean;
    constructor(method: any, url: any);
    setHeaders(headers: {
        [name: string]: string | string[];
    }, override?: {
        [name: string]: string | string[];
    }): NgxRequest;
    setBody(body: any): this;
    setObserve(type: any): NgxRequest;
    setParams(params: any): NgxRequest;
    setReportProgress(value: boolean): NgxRequest;
    setResponseType(type: any): NgxRequest;
    /**
     *
     * @param {boolean} value
     * @returns {NgxRequest}
     */
    setWithCredentials(value: boolean): NgxRequest;
}
