import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewMessagePage } from './view-message.page';

describe('ViewMessagePage', () => {
  let component: ViewMessagePage;
  let fixture: ComponentFixture<ViewMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
