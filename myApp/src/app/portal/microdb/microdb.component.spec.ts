import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrodbComponent } from './microdb.component';

describe('MicrodbComponent', () => {
  let component: MicrodbComponent;
  let fixture: ComponentFixture<MicrodbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrodbComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrodbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});