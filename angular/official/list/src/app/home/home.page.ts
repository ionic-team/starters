import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  private data = inject(DataService);
  protected readonly messages = this.data.getMessages();

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}
