import { NgxOauthClientPage } from './app.po';

describe('ngx-oauth-client App', () => {
  let page: NgxOauthClientPage;

  beforeEach(() => {
    page = new NgxOauthClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
