import { TestBed } from '@angular/core/testing';

import { EmailTakenService } from './email-taken.service';

describe('EmailTakenService', () => {
  let service: EmailTakenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailTakenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
