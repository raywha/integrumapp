import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthemailPage } from './authemail.page';

describe('AuthemailPage', () => {
  let component: AuthemailPage;
  let fixture: ComponentFixture<AuthemailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthemailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthemailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
