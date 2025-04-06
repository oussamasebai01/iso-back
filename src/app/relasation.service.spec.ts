import { TestBed } from '@angular/core/testing';

import { RelasationService } from './relasation.service';

describe('RelasationService', () => {
  let service: RelasationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelasationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
