import { TestBed } from '@angular/core/testing';

import { ClipsService } from './clips.service';

describe('ClipStorageService', () => {
  let service: ClipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
