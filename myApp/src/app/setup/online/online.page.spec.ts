import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnlinePage } from './online.page';

describe('OnlinePage', () => {
  let component: OnlinePage;
  let fixture: ComponentFixture<OnlinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
