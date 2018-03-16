import { Component } from '@angular/core';
import { Auth } from 'aws-amplify';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfirmSignInPage } from '../confirmSignIn/confirmSignIn';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';

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

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.loginDetails = new LoginDetails();
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    console.info('login..');
    Auth.signIn(details.username, details.password)
      .then(user => {
        console.debug('signed in user', user);
        if (user.challengeName === 'SMS_MFA') {
          this.navCtrl.push(ConfirmSignInPage, { user: user });
        } else {
          this.navCtrl.setRoot(TabsPage);
        }
      })
      .catch(err => console.debug('error', err))
      .then(() => loading.dismiss());
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
