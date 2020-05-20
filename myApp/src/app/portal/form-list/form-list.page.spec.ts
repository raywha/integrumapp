import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListPage } from './form-list.page';

describe('FormListPage', () => {
  let component: FormListPage;
  let fixture: ComponentFixture<FormListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
