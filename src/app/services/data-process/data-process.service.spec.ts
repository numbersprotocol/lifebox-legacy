import { TestBed } from '@angular/core/testing';

import { DataProcessService } from './data-process.service';

describe('DataProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataProcessService = TestBed.get(DataProcessService);
    expect(service).toBeTruthy();
  });
});
