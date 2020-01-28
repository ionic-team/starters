import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex: number = 0;
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/inbox',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/folder/outbox',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/folder/favorites',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/folder/archived',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/folder/trash',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/folder/spam',
      icon: 'warning'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path);
  }
}
