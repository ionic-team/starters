import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getPageOneTitleText() {
    return element(by.tagName('app-page-home')).element(by.tagName('ion-title')).element(by.css('.toolbar-title')).getText();
  }
}
