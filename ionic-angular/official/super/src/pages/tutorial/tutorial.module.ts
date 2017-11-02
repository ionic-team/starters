import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './tutorial';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TutorialPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialPage),
    TranslateModule.forChild()
  ],
  exports: [
    TutorialPage
  ]
})
export class TutorialPageModule { }
