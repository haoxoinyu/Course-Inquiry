import { TestBed } from '@angular/core/testing';

import { DingdingService } from './dingding.service';

describe('DingdingService', () => {
  let service: DingdingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DingdingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
