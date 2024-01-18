import { TestBed } from '@angular/core/testing';

import { CouponManagementService } from './coupon-management.service';

describe('CouponManagementService', () => {
  let service: CouponManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
