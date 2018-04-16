import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactPage } from './contact.page';

@NgModule({
  imports: [
    IonicModule,
    RouterModule.forChild([{ path: '', component: ContactPage }])
  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
