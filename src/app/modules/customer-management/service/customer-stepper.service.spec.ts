import { TestBed } from '@angular/core/testing';

import { CustomerStepperService } from './customer-stepper.service';

describe('CustomerStepperService', () => {
  let service: CustomerStepperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
