import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
  providers: [StatusBar, SplashScreen],
  bootstrap: [AppComponent]
})
export class AppModule {}
