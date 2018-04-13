import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ListPage } from './list.page';
import { ListPageRoutingModule } from './list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ListPageRoutingModule
  ],
  declarations: [
    ListPage,
  ]
})
export class ListPageModule { }