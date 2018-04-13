import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HomePage } from './pages/home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(private router: Router) {}

  appPages = [
    {
      title: 'Home',
      url: '/',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  navigate(url: string) {
    return this.router.navigateByUrl(url);
  }

}
