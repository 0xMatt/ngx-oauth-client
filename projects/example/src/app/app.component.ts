import {Component, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

export interface HttpRequest {
  url: string;
  method: string;
  options: {
    headers?: HttpHeaders
    observe?: string;
  };
  data?: any;
}

export enum Methods {
  GET,
  POST,
  PUT,
  DELETE
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  /**
   * @type {[string,string,string,string]}
   */
  methods: any = [];

  /**
   *
   * @type {Array}
   */
  headers = {};

  /**
   *
   * @type {{production: boolean; api: {host: string}}}
   */
  environment: any = environment;

  token;

  /**
   * @param request HttpRequest
   */
  request: HttpRequest;

  /**
   * @param response HttpResponse
   */
  response: HttpResponse<any> | HttpErrorResponse;

  /**
   *
   */
  responseBody: Object;
  tokenGrantType = 'client_credentials';
  tokenRequest = {
    password: {
      grant_type: 'password',
      client_id: 'bd8800924b6c6258727a',
      client_secret: '1fd03fca57fbb26d99a3bda8fb146f99b4cb8069',
      username: 'matt',
      password: '123123'
    },
    client_credentials: {
      grant_type: 'client_credentials',
      client_id: 'bd8800924b6c6258727a',
      client_secret: '1fd03fca57fbb26d99a3bda8fb146f99b4cb8069'
    }
  };

  /**
   * @constructor
   * @param api
   * @return void
   */
  constructor(private api: ApiService) {
    for (const method in Methods) {
      if (isNaN(parseFloat(method))) {
        this.methods.push(method);
      }
    }

    this.request = {
      url: 'users/1',
      method: 'GET',
      options: {}
    };

    const authToken = localStorage.getItem('auth_token');

    if (typeof authToken === 'string') {
      this.token = JSON.parse(authToken);
    }

    // this.addHeader('', '');
  }

  ngOnInit() {
    this.sendRequest(this.request);
  }

  getToken() {
    this.api.getToken(this.tokenGrantType, this.tokenRequest[this.tokenGrantType]).subscribe(response => {
      this.token = response;
      localStorage.setItem('auth_token', JSON.stringify(response));
    });
  }

  switchGrantType(type) {
    this.tokenGrantType = type;
  }

  /**
   * @param request
   */
  sendRequest(request: HttpRequest): void {
    const headers = this.headers,
      observe = 'response';

    let req: Observable<any>;
    const method = request.method.toLowerCase();
    if (['GET', 'DELETE', 'HEAD'].indexOf(request.method) !== -1) {
      req = this.api[method](this.request.url, {}, {headers, observe});
    } else {
      req = this.api[method](this.request.url, this.request.data, {headers, observe});
    }

    req.subscribe((res: any) => {
      const body = res.body;
      this.responseBody = body;
      delete res.body;
      this.response = res;
    }, (err: HttpErrorResponse) => {
      this.responseBody = err.error;
      this.response = err;
    });
  }

  getResponseType() {
    if (this.response instanceof HttpResponse) {
      return 'response';
    } else if (this.response instanceof HttpErrorResponse) {
      return 'error';
    }
  }

  /**
   * @param method
   */
  selectMethod(method: string): void {
    if (typeof Methods[method] === 'undefined') {
      return;
    }

    this.request.method = method;
  }

  removeToken(token: string) {
    const storageToken = localStorage.getItem('auth_token');
    this.token[token] = 'invalid';
    if (storageToken) {
      const parsedToken = JSON.parse(storageToken);
      parsedToken[token] = 'invalid';
      localStorage.setItem('auth_token', JSON.stringify(parsedToken));
    }
  }

  clearToken() {
    localStorage.removeItem('auth_token');
    this.token = undefined;
  }

  /**
   *
   */
  addHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  /**
   * @param key
   */
  removeHeader(key: string) {
    delete this.headers[key];
  }
}


