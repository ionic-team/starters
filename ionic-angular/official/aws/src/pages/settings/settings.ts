import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Auth } from 'aws-amplify';

import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public aboutPage = AboutPage;
  public accountPage = AccountPage;

  constructor(public app: App) {
  }

  logout() {
    Auth.signOut()
      .then(() => this.app.getRootNav().setRoot(LoginPage));
  }

}
