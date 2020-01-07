import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
      url: '/home',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/home',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/home',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/home',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/home',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/home',
      icon: 'warning'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public select(index: number) {
    const { title } = this.appPages[index];

    const event = new CustomEvent('sideMenuItemSelect', { detail: { page: title } });
    document.dispatchEvent(event);

    this.selectedIndex = index;
  }
}
