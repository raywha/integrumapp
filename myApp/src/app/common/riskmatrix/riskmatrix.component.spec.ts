import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiskmatrixComponent } from './riskmatrix.component';

describe('RiskmatrixComponent', () => {
  let component: RiskmatrixComponent;
  let fixture: ComponentFixture<RiskmatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskmatrixComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
