import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';

const logger = new Logger('SignUp');

export class UserDetails {
    username: string;
    email: string;
    password: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public userDetails: UserDetails;

  error: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController) {
   this.userDetails = new UserDetails();
  }

  signup() {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.userDetails;
    this.error = null;
    logger.debug('register');
    Auth.signUp(details.username, details.password, {'email': details.email})
      .then(user => {
        this.navCtrl.push(ConfirmPage, { username: details.username });
      })
      .catch(err => { this.error = err; })
      .then(() => loading.dismiss());
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

}
