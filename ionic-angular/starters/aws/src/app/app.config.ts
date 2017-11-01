import { Injectable } from '@angular/core';

declare var AWS: any;
declare const aws_mobile_analytics_app_id;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;
declare const aws_user_files_s3_bucket;

@Injectable()
export class AwsConfig {
  public load() {

    // Expects global const values defined by aws-config.js
    const cfg = {
      "aws_mobile_analytics_app_id": aws_mobile_analytics_app_id,
      "aws_cognito_region": aws_cognito_region,
      "aws_cognito_identity_pool_id": aws_cognito_identity_pool_id,
      "aws_user_pools_id": aws_user_pools_id,
      "aws_user_pools_web_client_id": aws_user_pools_web_client_id,
      "aws_user_files_s3_bucket": aws_user_files_s3_bucket
    };

    AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';

    return cfg;
  }
}
