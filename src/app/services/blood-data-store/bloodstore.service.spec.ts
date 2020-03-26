import { TestBed } from '@angular/core/testing';

import { BloodstoreService } from './bloodstore.service';

describe('BloodstoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodstoreService = TestBed.get(BloodstoreService);
    expect(service).toBeTruthy();
  });
});
