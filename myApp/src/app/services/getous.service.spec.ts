import { TestBed } from '@angular/core/testing';

import { GetousService } from './getous.service';

describe('GetousService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetousService = TestBed.get(GetousService);
    expect(service).toBeTruthy();
  });
});
