import {inject, TestBed} from '@angular/core/testing';
import {BaseRequestOptions, Http, HttpModule, RequestMethod, Response, ResponseOptions} from '@angular/http';
import {DEFAULT_CFG} from './default-config';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {NgxTestClient} from './ngx-testclient';
import {NgxOAuthClient} from './ngx-oauth-client';

describe('NgxOAuthClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions)
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        NgxTestClient,
      ]
    });
  });

  it('should be created', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(service instanceof NgxOAuthClient).toBeTruthy();
  }));

  it('should have default configuration', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(typeof service.getConfig()).toBe(typeof {});
    expect(service.getConfig().host).toBe('http://23.239.30.127:8080');
    expect(service.getConfig()).toBe(DEFAULT_CFG);
    expect(service.getDefaultHeaders()['Content-Type']).toBe('application/json');
  }));

  it('should should remove leading slash from path', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/status');

        connection.mockRespond(new Response(
          new ResponseOptions({body: ''})
        ));
      });

      service.get('/api/status').subscribe(() => done());
    })();
  });

  it('should convert get request parameters', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/users?username=foo');

        connection.mockRespond(new Response(
          new ResponseOptions({url: 'http://23.239.30.127:8080/api/users?username=foo', body: {}})
        ));
      });

      service.get('api/users', {username: 'foo'}).subscribe((response: Response) => {
        expect(response.url).toEqual('http://23.239.30.127:8080/api/users?username=foo');
        done();
      });
    })();
  });


  it('should be able to perform get requests', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {
      const mockResponse = [
        {id: 1, name: 'User 1'},
        {id: 2, name: 'User 2'},
        {id: 3, name: 'User 3'}
      ];

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/users');

        connection.mockRespond(new Response(
          new ResponseOptions({body: mockResponse})
        ));
      });

      service.get('api/users').subscribe((response: Response) => {
        const res = response.json();
        expect(res.length).toBe(3);
        expect(res[0].name).toEqual('User 1');
        expect(res[1].name).toEqual('User 2');
        expect(res[2].name).toEqual('User 3');
        done();
      });
    })();
  });


  it('should be able to perform post requests', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {

      const mockResponse = {
        username: 'bob',
        email: 'bob@bob.com',
        password: '123123'
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/users');
        expect(JSON.stringify(JSON.parse(connection.request.getBody()))).toBe(JSON.stringify(mockResponse));

        connection.mockRespond(new Response(
          new ResponseOptions({body: mockResponse})
        ));
      });

      service.post('api/users', mockResponse).subscribe((response: Response) => {
        expect(response.json()).toBe(mockResponse);
        done();
      });
    })();
  });

  it('should be able to perform put requests', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {

      const mockResponse = {
        username: 'bob',
        email: 'bob@bob.com',
        password: '123123'
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Put);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/users');
        expect(JSON.stringify(JSON.parse(connection.request.getBody()))).toBe(JSON.stringify(mockResponse));

        connection.mockRespond(new Response(
          new ResponseOptions({body: mockResponse})
        ));
      });

      service.put('api/users', mockResponse).subscribe((response: Response) => {
        expect(response.json()).toBe(mockResponse);
        done();
      });
    })();
  });

  it('should be able to perform delete requests', (done: any) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Delete);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/users/1');

        connection.mockRespond(new Response(
          new ResponseOptions({status: 204})
        ));
      });

      service.delete('api/users/1').subscribe((response: Response) => {
        expect(response.status).toBe(204);
        done();
      });
    })();
  });

  it('should let response interceptor change return value', (done) => {
    inject([NgxTestClient, MockBackend], (service: NgxTestClient, mockBackend: MockBackend) => {
      const mockResponse = {healthy: true};
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe('http://23.239.30.127:8080/api/status');

        connection.mockRespond(new Response(
          new ResponseOptions({body: mockResponse})
        ));
      });

      service.get('api/status').subscribe(response => {

        service.responseInterceptor = function (res: Response) {
          return res.json();
        };

        expect(service.responseInterceptor(response)).toEqual(mockResponse);
        done();
      });
    })();
  });

  it('should throw an error if endpoint is empty', inject([NgxTestClient], (service: NgxTestClient) => {
    expect(() => service.get('')).toThrow(new Error('Endpoint cannot be empty!'));
  }));

  it('should be able to authenticate with getToken()', inject([NgxTestClient], (service: NgxTestClient, done: any) => {
    service.getToken({username: 'matt', password: 123123}).subscribe(token => {
      expect(token).toContain('access_token');
      done();
    });
  }));
});
