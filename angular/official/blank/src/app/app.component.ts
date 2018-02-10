import { Component } from '@angular/core';

import { HomePage } from './pages/home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  pageHome = HomePage;

}
