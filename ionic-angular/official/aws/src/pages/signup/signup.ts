import { Component } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfirmSignUpPage } from '../confirmSignUp/confirmSignUp';
import { LoginPage } from '../login/login';

const logger = new Logger('SignUp');

export class UserDetails {
  username: string;
  email: string;
  phone_number: string;
  password: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public userDetails: UserDetails;

  error: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
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
    Auth.signUp(
      details.username,
      details.password,
      details.email,
      details.phone_number
    )
      .then(user => {
        this.navCtrl.push(ConfirmSignUpPage, { username: details.username });
      })
      .catch(err => {
        this.error = err;
      })
      .then(() => loading.dismiss());
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
