import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public page: string = 'Inbox';

  constructor() {
    document.addEventListener('sideMenuItemSelect', (ev: CustomEvent) => {
      this.page = ev.detail.page;
    });
  }

}
