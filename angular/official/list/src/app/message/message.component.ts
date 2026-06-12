import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Message } from '../services/data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  private platform = inject(Platform);
  readonly message = input<Message>();
  readonly isIos = this.platform.is('ios');
}
