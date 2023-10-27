import { Component } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp],
})
export class AppComponent {
  constructor() {}
}
