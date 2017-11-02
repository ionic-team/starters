import { Component, ViewChild } from '@angular/core';

import { Config, LoadingController, NavController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { DynamoDB, User } from '../../providers/providers';

declare var AWS: any;
declare const aws_user_files_s3_bucket;
declare const aws_user_files_s3_bucket_region;

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  @ViewChild('avatar') avatarInput;

  private s3: any;
  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public attributes: any;
  public sub: string = null;

  constructor(public navCtrl: NavController,
              public user: User,
              public db: DynamoDB,
              public config: Config,
              public camera: Camera,
              public loadingCtrl: LoadingController) {
    this.attributes = [];
    this.avatarPhoto = null;
    this.selectedPhoto = null;
    this.s3 = new AWS.S3({
      'params': {
        'Bucket': aws_user_files_s3_bucket
      },
      'region': aws_user_files_s3_bucket_region
    });
    this.sub = AWS.config.credentials.identityId;
    user.getUser().getUserAttributes((err, data) => {
      this.attributes = data;
      this.refreshAvatar();
    });
  }

  refreshAvatar() {
    this.s3.getSignedUrl('getObject', {'Key': 'protected/' + this.sub + '/avatar'}, (err, url) => {
      this.avatarPhoto = url;
    });
  }

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  selectAvatar() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.upload();
    }, (err) => {
      this.avatarInput.nativeElement.click();
      // Handle error
    });
  }

  uploadFromFile(event) {
    const files = event.target.files;
    console.log('Uploading', files)
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.selectedPhoto = this.dataURItoBlob(reader.result);
      this.upload();
    };
    reader.onerror = (error) => {
      alert('Unable to load file. Please try another.')
    }
  }

  upload() {
    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();

    if (this.selectedPhoto) {
      this.s3.upload({
        'Key': 'protected/' + this.sub + '/avatar',
        'Body': this.selectedPhoto,
        'ContentType': 'image/jpeg'
      }).promise().then((data) => {
        this.refreshAvatar();
        console.log('upload complete:', data);
        loading.dismiss();
      }, err => {
        console.log('upload failed....', err);
        loading.dismiss();
      });
    }
    loading.dismiss();

  }
}
