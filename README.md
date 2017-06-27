[![npm version](https://badge.fury.io/js/ngx-oauth-client.svg)](https://badge.fury.io/js/ngx-oauth-client)
[![Build Status](https://travis-ci.org/0xMatt/ngx-oauth-client.svg)](https://travis-ci.org/0xMatt/ngx-oauth-client?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/0xMatt/ngx-oauth-client/badge.svg?branch=master)](https://coveralls.io/github/0xMatt/ngx-oauth-client?branch=master)

ngx-oauth-client
===========

*ngx-oauth-client* is a simple module that...  

Check out the [demo](http://0xMatt.github.io/ngx-oauth-client/#demo)!

[Bug-reports or feature request](https://github.com/0xMatt/ngx-oauth-client/issues) are welcome!

## Getting started
Install it via npm:
```
npm install ngx-oauth-client -S
```

And add it as a dependency to your main module
```typescript
import {NgxOauthClientModule} from 'ngx-oauth-client/dist';

@NgModule({
  imports: [
    NgxOauthClientModule.forRoot(),
  ],
})
export class MainAppModule {
}
```
Using the library is easy:
```html
<ngx-oauth-client></ngx-oauth-client>
```
```typescript
export class SomeComponent {
    someAction(){
    }
}

```

## Configuration
Configuration is done via the forRoot method of the promise button module:
```typescript
import {NgxOauthClientModule} from 'ngx-oauth-client';

@NgModule({
  imports: [
    NgxOauthClientModule
      .forRoot({
        // your custom config goes here
      }),
  ],
})
export class MainAppModule {
}
```
