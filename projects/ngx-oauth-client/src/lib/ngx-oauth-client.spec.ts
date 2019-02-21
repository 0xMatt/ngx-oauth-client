import {inject, TestBed} from '@angular/core/testing';
import {NgxOAuthClient, DefaultHeaders, Configuration} from './ngx-oauth-client';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {NgxOAuthModule} from './ngx-oauth-client.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NgxOAuthResponse} from './ngx-oauth-response';
import { NgxOAuthConfig } from './ngx-oauth-config';
import { Injectable } from '@angular/core';

const DEFAULT_CFG: NgxOAuthConfig = {
  host: 'http://127.0.0.1',
  token: 'oauth/token',
  key: 'my_key',
  secret: 'my_secret',
};

@Configuration(DEFAULT_CFG)
@DefaultHeaders({
  'Content-Type': 'application/json'
})
@Injectable()
export class NgxTestClientOne extends NgxOAuthClient {
}

describe('NgxOAuthClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxOAuthModule, HttpClientTestingModule],
      providers: [NgxTestClientOne]
    });

    let store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
      return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
      return store[key] = <string>value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created via dependency injection', inject([NgxTestClientOne], (service: NgxTestClientOne) => {
    expect(service instanceof NgxOAuthClient).toBe(true);
    expect(service.getClient() instanceof HttpClient).toBe(true);
  }));

  it('should have default configuration', inject([NgxTestClientOne], (service: NgxTestClientOne) => {
    expect(typeof service.getConfig()).toBe(typeof {});
    expect(service.getConfig().host).toBe('http://127.0.0.1');
    expect(service.getConfig()).toBe(DEFAULT_CFG);
    expect(service.getDefaultHeaders()['Content-Type']).toBe('application/json');
  }));

  it('should return the HTTPCleint when getClient() is called', inject([NgxTestClientOne], (service: NgxTestClientOne) => {
    expect(service.getClient() instanceof HttpClient).toBe(true);
  }));

  it('should throw an error if endpoint is empty', inject([NgxTestClientOne], (service: NgxTestClientOne) => {
    expect(() => service.get('')).toThrow(new Error('Endpoint cannot be empty!'));
  }));

  it('should throw an error if an invalid grant_type is specified', inject([NgxTestClientOne], (service: NgxTestClientOne) => {
    expect(() => service.getToken('foo')).toThrow(new Error('Grant type foo is not supported'));
  }));

  it('expects a GET request',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.get('/api/users').subscribe(data => expect(data['username']).toEqual('foo'));
      const req = httpMock.expectOne('http://127.0.0.1/api/users');
      expect(req.request.method).toEqual('GET');
      req.flush({username: 'foo'});
      httpMock.verify();
    }));

  it('expects GET parameters to pass as HttpParams',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.get('/api/users', {foo: 'bar', bar: 'baz'}).subscribe(data => expect(data).toEqual('foo=bar'));
      const req = httpMock.expectOne('http://127.0.0.1/api/users?foo=bar&bar=baz');
      expect(req.request.method).toEqual('GET');
      req.flush('foo=bar');
      httpMock.verify();
    }));

  it('expects GET parameters to override payload passed in options',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.get('/api/users', {foo: 'bar'}, {params: new HttpParams().set('foo', 'baz')}).subscribe(data => expect(data).toEqual('foo=baz'));
      const req = httpMock.expectOne('http://127.0.0.1/api/users?foo=baz');
      expect(req.request.method).toEqual('GET');
      req.flush('foo=baz');
      httpMock.verify();
    }));

  it('expects a POST request',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.post('/api/users', {username: 'foo'}).subscribe(data => expect(data).toEqual({id: 1}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users');
      expect(req.request.method).toEqual('POST');
      req.flush({id: 1});
      httpMock.verify();
    }));

  it('expects a POST request with params to append params to url',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.post('/api/users', {username: 'foo'}, {params: new HttpParams().set('foo', 'bar')}).subscribe(
        data => expect(data).toEqual({id: 1})
      );
      const req = httpMock.expectOne('http://127.0.0.1/api/users?foo=bar');
      expect(req.request.method).toEqual('POST');
      req.flush({id: 1});
      httpMock.verify();
    }));

  it('expects a PUT request',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.put('/api/users/1', {username: 'foo'}).subscribe(data => expect(data).toEqual({id: 1}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
      expect(req.request.method).toEqual('PUT');
      req.flush({id: 1});
      httpMock.verify();
    }));

  it('expects a PATCH request',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.patch('/api/users/1', {foo: 'bar'}).subscribe(data => expect(data).toEqual({foo: 'bar'}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
      expect(req.request.method).toEqual('PATCH');
      req.flush({foo: 'bar'});
      httpMock.verify();
    }));

  it('expects a DELETE request',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.delete('/api/users/1').subscribe(data => expect(data).toEqual({}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
      httpMock.verify();
    }));

  it('should have errors intercepted',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.get('/api/users').subscribe(
        data => console.log,
        err => console.log
      );
      const req = httpMock.expectOne('http://127.0.0.1/api/users');
      expect(req.request.method).toEqual('GET');

      req.flush({success: false});
      httpMock.verify();
    }));

  it('expects a options to override default values',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.get('/api/users/1', {}, {withCredentials: true}).subscribe(data => expect(data).toEqual({}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
      expect(req.request.method).toEqual('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush({});
      httpMock.verify();
    }));

  it('should provide specific token key if requested', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    localStorage.setItem('auth_token', JSON.stringify({
      access_token: '123'
    }));

    expect(http.fetchToken('access_token')).toBe('123');
    expect(localStorage.getItem).toHaveBeenCalled();
  }));

  it('should provide full token token object if no key is specified', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    const response: NgxOAuthResponse = {
      access_token: '123',
      expires_in: 123,
      token_type: 'bearer'
    };
    http.setToken(response);

    expect(http.fetchToken()).toEqual(response);
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.getItem('auth_token')).toBeDefined();
  }));

  it('should return null if a token key is requested but not set', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    localStorage.setItem('auth_token', JSON.stringify({
      access_token: '123'
    }));

    expect(http.fetchToken('refresh_token')).toEqual(null);
    expect(localStorage.getItem).toHaveBeenCalled();
  }));

  it('should return null if a full token is requested but not set', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    expect(http.fetchToken()).toEqual(null);
    expect(localStorage.getItem).toHaveBeenCalled();
  }));

  it('should be able to clear existing tokens', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    const response: NgxOAuthResponse = {
      access_token: '123',
      expires_in: 123,
      token_type: 'bearer'
    };
    http.setToken(response);

    expect(http.fetchToken()).toEqual(response);
    expect(localStorage.getItem).toHaveBeenCalled();
    http.clearToken();
    expect(localStorage.removeItem).toHaveBeenCalled();
    expect(http.fetchToken()).toBeNull();
  }));

  it('should set a token without a prefix if not defined', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    const response: NgxOAuthResponse = {
      access_token: '123',
      expires_in: 123,
      token_type: 'bearer'
    };
    http.setToken(response);
    expect(localStorage.setItem).toHaveBeenCalled();
    const storage: string = localStorage.getItem('auth_token') || '';
    expect(JSON.parse(storage)).toEqual(response);
  }));

  it('should set a token without a prefix if defined', inject([NgxTestClientOne], (http: NgxTestClientOne) => {
    const response: NgxOAuthResponse = {
      access_token: '123',
      expires_in: 123,
      token_type: 'bearer'
    };
    http.setToken(response);
    expect(localStorage.setItem).toHaveBeenCalled();
    const storage: string = localStorage.getItem('auth_token') || '';
    expect(JSON.parse(storage)).toEqual(response);
  }));

  it('can authenticate with password credentials',
    inject([NgxTestClientOne, HttpTestingController], (http: NgxTestClientOne, httpMock: HttpTestingController) => {
      http.getToken().subscribe(data => expect(data).toEqual({
        access_token: '123',
        expires_in: 123
      }));
      const req = httpMock.expectOne('http://127.0.0.1/oauth/token');
      expect(req.request.method).toEqual('POST');
      req.flush({
        access_token: '123',
        expires_in: 123
      });
      httpMock.verify();
    }));
});
