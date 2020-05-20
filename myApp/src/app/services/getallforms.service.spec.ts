import { TestBed } from '@angular/core/testing';

import { GetallformsService } from './getallforms.service';

describe('GetallformsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetallformsService = TestBed.get(GetallformsService);
    expect(service).toBeTruthy();
  });
});
