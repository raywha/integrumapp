import { TestBed } from '@angular/core/testing';

import { GetAppPortalService } from './get-app-portal.service';

describe('GetAppPortalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAppPortalService = TestBed.get(GetAppPortalService);
    expect(service).toBeTruthy();
  });
});
