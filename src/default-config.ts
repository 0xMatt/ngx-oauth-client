import {NgxOAuthConfig} from './config-interface';

export const DEFAULT_CFG: NgxOAuthConfig = {
  host: 'http://127.0.0.1',
  token: 'oauth/token',
  key: 'my_key',
  withCredentials: true,
  tokens: {
    access: 'access_token',
    refresh: 'refresh_token'
  }
};

