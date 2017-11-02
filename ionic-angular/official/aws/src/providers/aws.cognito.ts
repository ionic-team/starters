import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';

declare var AWS: any;
declare var AWSCognito: any;

declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class Cognito {

  constructor(public config: Config) {
    AWSCognito.config.region = aws_cognito_region;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: aws_cognito_identity_pool_id
    });
    AWSCognito.config.update({customUserAgent: AWS.config.customUserAgent});
  }

  getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
      "UserPoolId": aws_user_pools_id,
      "ClientId": aws_user_pools_web_client_id
    });
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  makeAuthDetails(username, password) {
    return new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      'Username': username,
      'Password': password
    });
  }

  makeAttribute(name, value) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      'Name': name,
      'Value': value
    });
  }

  makeUser(username) {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      'Username': username,
      'Pool': this.getUserPool()
    });
  }


}
