import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';

@Component({
  selector: 'page-tasks-create',
  templateUrl: 'tasks-create.html'
})
export class TasksCreatePage {
  public isReadyToSave: boolean;

  public item: any;

  public isAndroid: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform
  ) {
    this.isAndroid = platform.is('android');
    this.item = {
      taskId: navParams.get('id'),
      category: 'Todo'
    };
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {}

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(this.item);
  }
}
