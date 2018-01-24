import { Injectable } from '@angular/core';
import { Auth, Logger } from 'aws-amplify';

declare var AWS: any;

const logger = new Logger('DynamoDB');

@Injectable()
export class DynamoDB {

  constructor() {
  }

  getDocumentClient() {
    return Auth.currentCredentials()
      .then(credentials => new AWS.DynamoDB.DocumentClient({ credentials: credentials }))
      .catch(err => logger.debug('error getting document client', err));
  }

}
