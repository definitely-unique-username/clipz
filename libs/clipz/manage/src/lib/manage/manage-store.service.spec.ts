import { TestBed } from '@angular/core/testing';

import { ManageStoreService } from './manage-store.service';

describe('ManageStoreService', () => {
  let service: ManageStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
