import { Component, ViewChild } from '@angular/core';

import { LoadingController, NavController } from 'ionic-angular';
import { Auth, Storage, Logger } from 'aws-amplify';

import { Camera, CameraOptions } from '@ionic-native/camera';

const logger = new Logger('Account');

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  @ViewChild('avatar') avatarInput;

  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public userId: string;
  public username: string;
  public attributes: any;

  constructor(public navCtrl: NavController,
              public camera: Camera,
              public loadingCtrl: LoadingController) {
    this.attributes = [];
    this.avatarPhoto = null;
    this.selectedPhoto = null;

    Auth.currentUserInfo()
      .then(info => {
        this.userId = info.id;
        this.username = info.username;
        this.attributes = [];
        if (info['email']) { this.attributes.push({ name: 'email', value: info['email']}); }
        if (info['phone_number']) { this.attributes.push({ name: 'phone_number', value: info['phone_number']}); }
        this.refreshAvatar();
      });
  }

  refreshAvatar() {
    Storage.get(this.userId + '/avatar')
      .then(url => this.avatarPhoto = (url as string));
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
    logger.debug('Uploading', files)

    const file = files[0];
    const { type } = file;
    Storage.put(this.userId + '/avatar', file, { contentType: type })
      .then(() => this.refreshAvatar())
      .catch(err => logger.error(err));
  }

  upload() {
    if (this.selectedPhoto) {
      let loading = this.loadingCtrl.create({
        content: 'Uploading image...'
      });
      loading.present();

      Storage.put(this.userId + '/avatar', this.selectedPhoto, { contentType: 'image/jpeg' })
        .then(() => {
          this.refreshAvatar()
          loading.dismiss();
        })
        .catch(err => {
          logger.error(err)
          loading.dismiss();
        });
    }
  }
}
