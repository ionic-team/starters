import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    RouterModule.forChild([
      {
        path: 'tabs',
        component: TabsPage,
        children: [
          // tab one
          {
            path: 'home',
            loadChildren: 'app/pages/home/home.page.module#HomePageModule',
            outlet: 'home'
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
