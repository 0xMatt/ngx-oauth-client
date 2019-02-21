export const environment = {
  production: true,
  api: {
    host: 'https://mattj-demo.sandbox.knetikcloud.com',
    token: 'oauth/token',
    key: 'knetik',
    withCredentials: true,
    tokens: {
      access: 'access_token',
      refresh: 'refresh_token'
    }
  }
};
