import {Configuration, NgxOAuthClient} from './ngx-oauth-client';
import {Injectable} from '@angular/core';

@Configuration({
  host: 'http://127.0.0.1',
  token: 'oauth/token',
  key: 'my_key',
  storage_prefix: 'two_'
})
@Injectable()
export class NgxTestClientTwo extends NgxOAuthClient {
}
