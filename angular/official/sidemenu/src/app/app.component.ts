import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail',
    },
    {
      title: 'Outbox',
      url: '/folder/Outbox',
      icon: 'paper-plane',
    },
    {
      title: 'Favorites',
      url: '/folder/Favorites',
      icon: 'heart',
    },
    {
      title: 'Archived',
      url: '/folder/Archived',
      icon: 'archive',
    },
    {
      title: 'Trash',
      url: '/folder/Trash',
      icon: 'trash',
    },
    {
      title: 'Spam',
      url: '/folder/Spam',
      icon: 'warning',
    },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() {}

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
