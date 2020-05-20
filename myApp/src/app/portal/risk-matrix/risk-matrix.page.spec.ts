import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMatrixPage } from './risk-matrix.page';

describe('RiskMatrixPage', () => {
  let component: RiskMatrixPage;
  let fixture: ComponentFixture<RiskMatrixPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMatrixPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMatrixPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
