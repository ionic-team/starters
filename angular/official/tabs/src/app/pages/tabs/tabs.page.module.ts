import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.page.module';
import { HomePage } from '../home/home.page';
import { AboutPage } from '../about/about.page';
import { ContactPage } from '../contact/contact.page';
import { ContactPageModule } from '../contact/contact.page.module';
import { AboutPageModule } from '../about/about.page.module';

          // Blocked by angular
          // loadChildren: 'app/pages/home/home.page.module#HomePageModule',
@NgModule({
  imports: [
    IonicModule,
    HomePageModule,
    AboutPageModule,
    ContactPageModule,
    RouterModule.forChild([
      {
        path: 'tabs',
        component: TabsPage,
        children: [

          {
            path: 'home',
            outlet: 'home',
            component: HomePage
          },
          {
            path: 'about',
            outlet: 'about',
            component: AboutPage
          },
          {
            path: 'contact',
            outlet: 'contact',
            component: ContactPage
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
