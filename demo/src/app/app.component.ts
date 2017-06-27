import {Component, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {Headers, RequestOptions, Response} from '@angular/http';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * @type {[string,string,string,string]}
   */
  methods: any = [];

  headers: any = [];

  environment: any = environment;
  /**
   * @param request HttpRequest
   */
  request: HttpRequest;

  /**
   * @param response HttpResponse
   */
  response: Response;

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
      url: '',
      method: 'GET',
      data: [],
      options: new RequestOptions()
    };
    this.addHeader('', '');
  }

  ngOnInit() {
    this.request = {
      url: 'users/1',
      method: 'GET',
      options: new RequestOptions()
    };
    this.sendRequest(this.request);
  }

  /**
   * @param request
   */
  sendRequest(request: HttpRequest): void {
    request.options.headers = new Headers();
    this.headers.filter((header: any) => {
      return header.key !== '';
    }).forEach((header: any) => {
      if (request.options.headers === null) {
        request.options.headers = new Headers();
      }

      request.options.headers.append(header.key, header.value);
    });
    this.api[request.method.toLowerCase()](request.url, request.data, request.options).subscribe((res: Response) => {
      this.response = res;
    }, (err: any) => this.response = err);
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

  /**
   *
   */
  addHeader(key: string, value: string) {
    this.headers.push({key, value});
  }

  /**
   * @param index
   */
  removeHeader(index: number) {
    this.headers.splice(index, 1);
  }
}


export interface HttpRequest {
  url: string;
  method: string;
  options: RequestOptions;
  data?: any;
}

export enum Methods {
  GET,
  POST,
  PUT,
  DELETE
}
