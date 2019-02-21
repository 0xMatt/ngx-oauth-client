// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    host: 'https://api.github.com',
    token: 'oauth/token',
    key: 'bd8800924b6c6258727a',
    secret: '1fd03fca57fbb26d99a3bda8fb146f99b4cb8069',
    withCredentials: true,
    tokens: {
      access: '',
      refresh: 'refresh_token'
    }
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
