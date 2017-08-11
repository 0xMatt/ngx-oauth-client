import {Configuration, DefaultHeaders, NgxOAuthClient} from './ngx-oauth-client';
import {Injectable} from '@angular/core';
import {DEFAULT_CFG} from './default-config';

@Configuration(DEFAULT_CFG)
@DefaultHeaders({
  'Content-Type': 'application/json'
})
@Injectable()
export class NgxTestClientOne extends NgxOAuthClient {
}
