import { TestBed } from '@angular/core/testing';

import { GetpersoninfoService } from './getpersoninfo.service';

describe('GetpersoninfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetpersoninfoService = TestBed.get(GetpersoninfoService);
    expect(service).toBeTruthy();
  });
});
