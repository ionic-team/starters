import { Component, computed, inject, input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  standalone: false,
})
export class ViewMessagePage {
  private data = inject(DataService);
  private platform = inject(Platform);

  readonly id = input.required<string>();
  protected readonly message = computed(() => this.data.getMessageById(parseInt(this.id(), 10)));
  protected readonly backButtonText = this.platform.is('ios') ? 'Inbox' : '';
}
