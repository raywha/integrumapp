import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdatedownloadPage } from './updatedownload.page';

describe('UpdatedownloadPage', () => {
  let component: UpdatedownloadPage;
  let fixture: ComponentFixture<UpdatedownloadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedownloadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatedownloadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
