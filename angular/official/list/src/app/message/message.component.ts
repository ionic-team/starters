import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../services/data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  
  constructor() { }

  ngOnInit() {}

}
