import { TestBed } from '@angular/core/testing';

import { DataRenderService } from './data-render.service';

describe('DataRenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataRenderService = TestBed.get(DataRenderService);
    expect(service).toBeTruthy();
  });
});
