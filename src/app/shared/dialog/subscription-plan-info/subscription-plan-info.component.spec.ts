import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanInfoComponent } from './subscription-plan-info.component';

describe('SubscriptionPlanInfoComponent', () => {
  let component: SubscriptionPlanInfoComponent;
  let fixture: ComponentFixture<SubscriptionPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPlanInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
