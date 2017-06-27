[![npm version](https://badge.fury.io/js/ngx-oauth-client.svg)](https://badge.fury.io/js/ngx-oauth-client)
[![Build Status](https://travis-ci.org/0xMatt/ngx-oauth-client.svg)](https://travis-ci.org/0xMatt/ngx-oauth-client?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/0xMatt/ngx-oauth-client/badge.svg?branch=master)](https://coveralls.io/github/0xMatt/ngx-oauth-client?branch=master)

ngx-oauth-client
===========

*ngx-oauth-client* is an Angular2/4 HTTP/OAuth2 client. This package allows you to set up multiple clients to interface with many OAuth2 compliant APIs.

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
    responseIntereptor(response: Response) {
      return response.json();
    }
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
}

```

## OAuth2.0

Built-in support for authenticating via OAuth2 has been provided, you can use the `getToken` method to perform any authentication method to retrieve a token from the OAuth server.


## Password
```typescript
MyApiClient.getToken({
  username: 'bob',
  password: '123123'
}, 'password').subscribe((token: any) => {
  localStorage.setItem('access_token', token.access_token);
  if(token.refresh_token) {
      localStorage.setItem('refresh_token', token.refresh_token);
  }
});
```

## Client Credentials

```typescript
MyApiClient.getToken({}, 'client_credentials').subscribe((token: any) => {
  localStorage.setItem('access_token', token.access_token);
});
```

## Authorization Code

```typescript
MyApiClient.getToken({authorization_code: '123'}, 'auth_code').subscribe((token: any) => {
  localStorage.setItem('access_token', token.access_token);
});
```

## Interceptors

### Request Interceptor

The request interceptor allows you to modify request options globally

```typescript
requestInterceptor(opts: RequestOptions) {
  // You can modify the current request options here
  return options;
}
```

### Request Interceptor

The response interceptor allows you to modify the return value from requests

```typescript
responseInterceptor(res: Response) {
  return res.json();
}

```


### Error Interceptor

The error interceptor allows you to handle erroneous requests

```typescript
errorInterceptor(err, req) {
  if(err.status === 401) {
    localStorage.removeItem('token');
    if(localStorage.getItem('refresh')) {
      return this.getToken('refresh').mergeMap(req.retry);
    }
  }
  return Observable.throw(err);
}

```
