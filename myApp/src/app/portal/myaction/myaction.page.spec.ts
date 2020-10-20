import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyactionPage } from './myaction.page';

describe('MyactionPage', () => {
  let component: MyactionPage;
  let fixture: ComponentFixture<MyactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyactionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
