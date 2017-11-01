import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { User } from '../../providers/user';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {
  
  public code: string;
  public username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User) {
    this.username = navParams.get('username');
  }

  confirm() {
    this.user.confirmRegistration(this.username, this.code).then(() => {
      this.navCtrl.push(LoginPage);
    });
  }

  resendCode() {
    this.user.resendRegistrationCode(this.username);
  }


}
