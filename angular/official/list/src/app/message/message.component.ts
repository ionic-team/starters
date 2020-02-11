import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../services/data.service';
import { Config } from '@ionic/angular';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  constructor(
    private config: Config
  ) { }

  ngOnInit() {}

  isIos() {
    return this.config.get('mode') === 'ios';
  }
}
