import { Component, input } from '@angular/core';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: false,
})
export class FolderPage {
  readonly folder = input.required<string>();
}
