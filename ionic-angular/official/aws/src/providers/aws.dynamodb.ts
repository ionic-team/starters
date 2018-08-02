import { Injectable } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';
import AWS from 'aws-sdk';
const aws_exports = require('../aws-exports').default;

AWS.config.region = aws_exports.aws_project_region;
AWS.config.update({customUserAgent: 'ionic-starter'});

const logger = new Logger('DynamoDB');

@Injectable()
export class DynamoDB {

  constructor() {
  }

  getDocumentClient() {
    return Auth.currentCredentials()
      .then(credentials => new AWS.DynamoDB.DocumentClient({ credentials: credentials }))
      .catch(err => { logger.debug('error getting document client', err); throw err; });
  }

}
