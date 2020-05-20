import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginpassPage } from './loginpass.page';

describe('LoginpassPage', () => {
  let component: LoginpassPage;
  let fixture: ComponentFixture<LoginpassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginpassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
