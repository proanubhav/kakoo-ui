import { TestBed, inject } from '@angular/core/testing';

import { RhManagementService } from './rh-management.service';

describe('RhManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RhManagementService]
    });
  });

  it('should be created', inject([RhManagementService], (service: RhManagementService) => {
    expect(service).toBeTruthy();
  }));
});
