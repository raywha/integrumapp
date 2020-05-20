import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionPage } from './add-action.page';

describe('AddActionPage', () => {
  let component: AddActionPage;
  let fixture: ComponentFixture<AddActionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
