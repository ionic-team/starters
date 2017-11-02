import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { ConfirmPage } from '../confirm/confirm';

import { User } from '../../providers/providers';

export class LoginDetails {
  username: string;
  password: string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  public loginDetails: LoginDetails;

  constructor(public navCtrl: NavController,
              public user: User,
              public loadingCtrl: LoadingController) {
    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    console.log('login..');
    this.user.login(details.username, details.password).then((result) => {
      console.log('result:', result);
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    }).catch((err) => { 
      if (err.message === "User is not confirmed.") {
        loading.dismiss();
        this.navCtrl.push(ConfirmPage, { 'username': details.username });
      }
      console.log('errrror', err);
      loading.dismiss();
    });
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

}
