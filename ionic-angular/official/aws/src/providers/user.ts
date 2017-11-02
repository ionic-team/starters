import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';

import { Cognito } from './providers';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class User {

  private user: any;
  public loggedIn: boolean = false;

  constructor(public cognito: Cognito, public config: Config) {
    this.user = null;
  }

  getUser() {
    return this.user;
  }

  getUsername() {
    return this.getUser().getUsername();
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      let authDetails = this.cognito.makeAuthDetails(username, password);

      user.authenticateUser(authDetails, {
        'onSuccess': (result:any) => {

          var logins = {};
          var loginKey = 'cognito-idp.' +
                          aws_cognito_region +
                          '.amazonaws.com/' +
                          aws_user_pools_id;
          logins[loginKey] = result.getIdToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           'IdentityPoolId': aws_cognito_identity_pool_id,
           'Logins': logins
          });
          
          this.isAuthenticated().then(() => {
            resolve();
          }).catch((err) => {
            console.log('auth session failed');
          });

        },

        'onFailure': (err:any) => {

          console.log('authentication failed');
          reject(err);

        }
      });
    });
  }

  logout() {
    this.user = null;
    this.cognito.getUserPool().getCurrentUser().signOut();
  }

  register(username, password, attr) {
    let attributes = [];

    for (var x in attr) {
      attributes.push(this.cognito.makeAttribute(x, attr[x]));
    }

    return new Promise((resolve, reject) => {
      this.cognito.getUserPool().signUp(username, password, attributes, null, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  confirmRegistration(username, code) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.confirmRegistration(code, true, (err, result) => {
            if (err) {
              console.log('could not confirm user', err);
              reject(err);
            } else {
              resolve(result);
            }
        });
    });
  }

  resendRegistrationCode(username) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.resendConfirmationCode((err, result) => {
        if (err) {
          console.log('could not resend code..', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      let user = this.cognito.getCurrentUser();
      if (user != null) {
        user.getSession((err, session) => {
          if (err) {
            console.log('rejected session');
            reject()
          } else {
            console.log('accepted session');
            var logins = {};
            var loginKey = 'cognito-idp.' +
              aws_cognito_region +
              '.amazonaws.com/' +
              aws_user_pools_id;
            logins[loginKey] = session.getIdToken().getJwtToken();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              'IdentityPoolId': aws_cognito_identity_pool_id,
              'Logins': logins
            });

            this.user = user;
            resolve()
          }
        });
      } else {
        reject()
      }
    });
  }
}
