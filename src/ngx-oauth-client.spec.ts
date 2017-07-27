import {inject, TestBed} from '@angular/core/testing';
import {DEFAULT_CFG} from './default-config';
import {NgxTestClient} from './ngx-testclient';
import {NgxOAuthClient} from './ngx-oauth-client';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {NgxOAuthModule} from './ngx-oauth.module';

describe('NgxOAuthClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxOAuthModule, HttpClientTestingModule],
      providers: [NgxTestClient]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(service instanceof NgxOAuthClient).toBeTruthy();
  }));

  it('should have default configuration', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(typeof service.getConfig()).toBe(typeof {});
    expect(service.getConfig().host).toBe('http://127.0.0.1');
    expect(service.getConfig()).toBe(DEFAULT_CFG);
    expect(service.getDefaultHeaders()['Content-Type']).toBe('application/json');
  }));

  it('should throw an error if endpoint is empty', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(() => service.get('')).toThrow(new Error('Endpoint cannot be empty!'));
  }));

  it('should throw an error if an invalid grant_type is specified', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(() => service.getToken('foo')).toThrow(new Error('Grant type foo is not supported'));
  }));

  it('expects a GET request', inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
    http.get('/api/users').subscribe(data => expect(data['username']).toEqual('foo'));
    const req = httpMock.expectOne('http://127.0.0.1/api/users');
    expect(req.request.method).toEqual('GET');
    req.flush({username: 'foo'});
    httpMock.verify();
  }));

  it('expects GET parameters to pass as HttpParams',
    inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
      http.get('/api/users', {foo: 'bar'}).subscribe();
      const req = httpMock.expectOne('http://127.0.0.1/api/users');
      expect(req.request.method).toEqual('GET');
      req.flush('foo=bar');
      httpMock.verify();
    }));

  it('expects a POST request', inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
    http.post('/api/users', {username: 'foo'}).subscribe(data => expect(data).toEqual({id: 1}));
    const req = httpMock.expectOne('http://127.0.0.1/api/users');
    expect(req.request.method).toEqual('POST');
    req.flush({id: 1});
    httpMock.verify();
  }));

  it('expects a PUT request', inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
    http.put('/api/users/1', {username: 'foo'}).subscribe(data => expect(data).toEqual({id: 1}));
    const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
    expect(req.request.method).toEqual('PUT');
    req.flush({id: 1});
    httpMock.verify();
  }));

  it('expects a PATCH request', inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
    http.patch('/api/users/1', {foo: 'bar'}).subscribe(data => expect(data).toEqual({foo: 'bar'}));
    const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
    expect(req.request.method).toEqual('PATCH');
    req.flush({foo: 'bar'});
    httpMock.verify();
  }));

  it('expects a DELETE request', inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
    http.delete('/api/users/1').subscribe(data => expect(data).toEqual({}));
    const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
    httpMock.verify();
  }));

  it('expects a options to override default values',
    inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
      http.get('/api/users/1', {foo: 'bar'}, {withCredentials: true}).subscribe(data => expect(data).toEqual({}));
      const req = httpMock.expectOne('http://127.0.0.1/api/users/1');
      expect(req.request.method).toEqual('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush({});
      httpMock.verify();
    }));

  it('can authenticate with password credentials',
    inject([NgxTestClient, HttpTestingController], (http: NgxTestClient, httpMock: HttpTestingController) => {
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
