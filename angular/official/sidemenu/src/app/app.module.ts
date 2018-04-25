import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home', loadChildren: './pages/home/home.module#HomePageModule'
      },
      {
        path: 'list', loadChildren: './pages/list/list.module#ListPageModule'
      },
      // uncomment when alpha.4 is out
      // {
      //   path: 'list/:selectedItem', loadChildren: './pages/list/list.module#ListPageModule'
      // }
    ]),
    IonicModule.forRoot(),
    ComponentsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
