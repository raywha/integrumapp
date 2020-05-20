import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SannerPage } from './sanner.page';

describe('SannerPage', () => {
  let component: SannerPage;
  let fixture: ComponentFixture<SannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SannerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
