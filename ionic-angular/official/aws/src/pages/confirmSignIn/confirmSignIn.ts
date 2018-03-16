import { Component } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

const logger = new Logger('ConfirmSignIn');

@Component({
  selector: 'page-confirm-signin',
  templateUrl: 'confirmSignIn.html'
})
export class ConfirmSignInPage {
  public code: string;
  public user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get('user');
  }

  confirm() {
    Auth.confirmSignIn(this.user, this.code)
      .then(() => this.navCtrl.push(TabsPage))
      .catch(err => logger.debug('confirm error', err));
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
