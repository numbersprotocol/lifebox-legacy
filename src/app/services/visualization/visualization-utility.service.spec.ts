import { TestBed } from '@angular/core/testing';

import { VisualizationUtilityService } from './visualization-utility.service';

describe('VisualizationUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizationUtilityService = TestBed.get(VisualizationUtilityService);
    expect(service).toBeTruthy();
  });
});
