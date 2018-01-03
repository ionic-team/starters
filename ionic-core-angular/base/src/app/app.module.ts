import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicAngularModule } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home.page';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
  ],
  entryComponents: [
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicAngularModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
