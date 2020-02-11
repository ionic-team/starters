import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/inbox');
    });
    it('should have a title saying Inbox', () => {
      page.getPageOneTitleText().then(title => {
        expect(title).toEqual('Inbox');
      });
    });
  });
});
