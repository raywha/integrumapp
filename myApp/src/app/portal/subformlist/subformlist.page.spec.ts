import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubformlistPage } from './subformlist.page';

describe('SubformlistPage', () => {
  let component: SubformlistPage;
  let fixture: ComponentFixture<SubformlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubformlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubformlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
