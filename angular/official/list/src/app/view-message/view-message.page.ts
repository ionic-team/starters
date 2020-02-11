import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Message } from '../services/data.service';
import { Config } from '@ionic/angular';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public message: Message;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private config: Config
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.message = this.data.getMessageById(parseInt(id, 10));
  }

  getBackButtonText() {
    return this.config.get('mode') === 'ios' ? 'Inbox' : '';
  }
}
