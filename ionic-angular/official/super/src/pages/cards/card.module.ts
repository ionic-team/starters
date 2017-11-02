import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CardsPage } from './cards';

@NgModule({
  declarations: [
    CardsPage,
  ],
  imports: [
    IonicPageModule.forChild(CardsPage),
    TranslateModule.forChild()
  ],
  exports: [
    CardsPage
  ]
})
export class CardsPageModule { }
