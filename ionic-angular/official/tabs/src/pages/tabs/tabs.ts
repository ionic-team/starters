import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tab1Root = HomePage;
  public tab2Root = AboutPage;
  public tab3Root = ContactPage;

  constructor() {}
}
