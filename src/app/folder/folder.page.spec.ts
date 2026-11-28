import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { FolderPageModule } from './folder.module';
import { FolderPage } from './folder.page';

describe('FolderPage', () => {
  let component: FolderPage;
  let fixture: ComponentFixture<FolderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderPageModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FolderPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('folder', 'Inbox');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
