import { Component, inject } from '@angular/core';
import type { RefresherCustomEvent } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
} from '@ionic/angular';

import { MessageComponent } from '../message/message.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList, MessageComponent],
})
export class HomePage {
  private data = inject(DataService);
  protected readonly messages = this.data.getMessages();

  refresh(ev: any): void {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}
