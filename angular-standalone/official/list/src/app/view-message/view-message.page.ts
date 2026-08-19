import { Component, computed, inject, input } from '@angular/core';
import { Platform, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote],
})
export class ViewMessagePage {
  private data = inject(DataService);
  private platform = inject(Platform);

  readonly id = input.required<string>();
  protected readonly message = computed(() => this.data.getMessageById(parseInt(this.id(), 10)));
  protected readonly backButtonText = this.platform.is('ios') ? 'Inbox' : '';

  constructor() {
    addIcons({ personCircle });
  }
}
