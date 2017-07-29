[![npm version](https://badge.fury.io/js/ngx-oauth-client.svg)](https://badge.fury.io/js/ngx-oauth-client)
[![Build Status](https://travis-ci.org/0xMatt/ngx-oauth-client.svg)](https://travis-ci.org/0xMatt/ngx-oauth-client?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/0xMatt/ngx-oauth-client/badge.svg?branch=master)](https://coveralls.io/github/0xMatt/ngx-oauth-client?branch=master)

ngx-oauth-client
===========

*ngx-oauth-client* is an Angular4 HTTP/OAuth2 client utilizing the HttpClient. This package allows you to set up multiple clients to interface with many OAuth2 compliant APIs.

Check out the [demo](http://0xMatt.github.io/ngx-oauth-client/#demo)!

[Bug-reports or feature request](https://github.com/0xMatt/ngx-oauth-client/issues) are welcome!

## Getting started
Install it via npm:
```
npm install ngx-oauth-client -S
```
And add it as a dependency to your main module
```typescript
import {NgxOAuthModule} from 'ngx-oauth-client';
@NgModule({
  imports: [
    NgxOAuthModule
  ],
})
export class AppModule {
}
```
Using the library is easy, just create your extending class and configure it:

```typescript
import {NgxOAuthClient, DefaultHeaders, Configuration} from 'ngx-oauth-client';
@Configuration({
  host: 'https://jsonplaceholder.typicode.com'
})
@DefaultHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
})
export class MyApiClient extends NgxOAuthClient {

}

```

## Configuration
Configuration is done via the Configuration decorator, the api is simple
```typescript
interface NgxOAuthConfig {
  host: string;
  token?: string;
  key?: string;
  secret?: string;
  storage_prefix? string;
}

```

## OAuth2.0

Built-in support for authenticating via OAuth2 has been provided, you can use the `getToken` method to perform any authentication method to retrieve a token from the OAuth server.

You may use `fetchToken(key?)` to retrieve details about a specific token property or get the entire `NgxOAuthResponse` object by not supplying a value to the function parameter.

## Client Credentials

```typescript
MyApiClient.getToken().subscribe((token: NgxOAuthResponse) => {
  // Token is already set for you
  MyApiClient.fetchToken('access_token'); // your_token_from_response
});
```

## Password
```typescript
MyApiClient.getToken('password', {
  username: 'bob',
  password: '123123'
}).subscribe((token: NgxOAuthResponse) => {
  // Token is already set for you
  MyApiClient.fetchToken('access_token'); // your_access_token_from_response
  MyApiClient.fetchToken('refresh_token'); // your_refresh_token_from_response
});
```

## Authorization Code

```typescript
MyApiClient.getToken('authorization_code', {authorization_code: '123'}.subscribe((token: NgxOAuthResponse) => {
  // Token is already set for you
  MyApiClient.fetchToken('access_token'); // your_access_token_from_response
  MyApiClient.fetchToken('refresh_token'); // your_refresh_token_from_response
});
```

## Interceptors

While the HttpClient now providers interceptors, they are in fact global. Having interceptor methods allows you to have client-specific interceptor rules.

### Request Interceptor

The example demonstrates adding an authorization header to your requests if your criteria is met.

```typescript
requestInterceptor(request) {
    const auth = this.fetchToken();
    if (auth) {
      return request.setHeaders({Authorization: auth.token_type + auth.access_token});
    }

    return request;
}
```

### Request Interceptor

The response interceptor allows you to modify the return value from requests

```typescript
responseInterceptor(request, response) {
  return response;
}

```


### Error Interceptor

The error interceptor allows you to handle erroneous requests

```typescript
errorInterceptor(request, error): Observable<any> {
  if (error.status === 401) {
    const refresh_token = this.fetchToken('refresh_token');
    if (!refresh_token) {
      return Observable.throw(error);
    }
    return this.getToken('refresh_token', {refresh_token}).switchMap(token => {
      localStorage.setItem('auth_token', JSON.stringify(token));
      return this.getClient().request(
        request.method,
        request.url,
        this.requestInterceptor(request.setHeaders({Authorization: 'Bearer ' + token}))
      );
    });
  }
  return Observable.throw(error);
}

```

### Credits

 - [KnetikCloud](http://knetikcloud.com) for providing the backend service that the demo utilizes
 - [@johannesjo](https://github.com/johannesjo) for his [angular generator](https://github.com/johannesjo/generator-angular2-lib) used for building this library
