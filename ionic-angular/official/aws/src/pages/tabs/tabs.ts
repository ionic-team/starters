import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { TasksPage } from '../tasks/tasks';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tab1Root = TasksPage;
  public tab2Root = SettingsPage;

  constructor() {}
}
