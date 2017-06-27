import {Configuration, DefaultHeaders, NgxOAuthClient} from './ngx-oauth-client';
import {DEFAULT_CFG} from './default-config';
import {Injectable} from '@angular/core';

@Configuration(DEFAULT_CFG)
@DefaultHeaders({
  'Content-Type': 'application/json'
})
@Injectable()
export class NgxTestClient extends NgxOAuthClient {

}
