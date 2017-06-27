import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ApiService} from './api.service';
import {NgxOAuthModule} from './component-symlink';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxOAuthModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
