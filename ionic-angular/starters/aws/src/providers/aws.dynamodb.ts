import { Injectable } from '@angular/core';

declare var AWS: any;

@Injectable()
export class DynamoDB {

  private documentClient: any;

  constructor() {
    this.documentClient = new AWS.DynamoDB.DocumentClient();
  }

  getDocumentClient() {
    return this.documentClient;
  }

}
