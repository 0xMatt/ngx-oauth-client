import {Configuration, DefaultHeaders, NgxOAuthClient} from './component-symlink';
import {environment} from '../environments/environment';

@Configuration(environment.api)
@DefaultHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
})
export class ApiService extends NgxOAuthClient {

}
