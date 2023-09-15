import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRefundComponent } from './subscription-refund.component';

describe('SubscriptionRefundComponent', () => {
  let component: SubscriptionRefundComponent;
  let fixture: ComponentFixture<SubscriptionRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionRefundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
