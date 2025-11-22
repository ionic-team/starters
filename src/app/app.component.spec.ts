import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // TODO(ROU-10799): Fix the flaky test.
  xit('should have menu labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(12);
    expect(menuItems[0].textContent).toContain('Inbox');
    expect(menuItems[1].textContent).toContain('Outbox');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(12);
    expect(menuItems[0].getAttribute('href')).toEqual('/folder/inbox');
    expect(menuItems[1].getAttribute('href')).toEqual('/folder/outbox');
  });

});
