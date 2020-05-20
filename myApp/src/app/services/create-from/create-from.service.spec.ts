import { TestBed } from '@angular/core/testing';

import { CreateFromService } from './create-from.service';

describe('CreateFromService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateFromService = TestBed.get(CreateFromService);
    expect(service).toBeTruthy();
  });
});
