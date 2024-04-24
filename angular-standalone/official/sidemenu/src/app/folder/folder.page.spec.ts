import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

describe('FolderPage', () => {
  let component: FolderPage;
  let fixture: ComponentFixture<FolderPage>;

  beforeEach(async () => {
    TestBed.overrideComponent(FolderPage, {
      add: {
        imports: [RouterModule]
      }
    });

    fixture = TestBed.createComponent(FolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
