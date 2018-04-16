import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot([
      { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
