import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LastreleasePage } from './lastrelease.page';

describe('LastreleasePage', () => {
  let component: LastreleasePage;
  let fixture: ComponentFixture<LastreleasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastreleasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LastreleasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
