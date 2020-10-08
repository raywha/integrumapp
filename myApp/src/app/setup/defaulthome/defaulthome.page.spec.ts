import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefaulthomePage } from './defaulthome.page';

describe('DefaulthomePage', () => {
  let component: DefaulthomePage;
  let fixture: ComponentFixture<DefaulthomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaulthomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaulthomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
