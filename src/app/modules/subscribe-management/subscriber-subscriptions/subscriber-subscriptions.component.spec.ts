import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberSubscriptionsComponent } from './subscriber-subscriptions.component';

describe('SubscriberSubscriptionsComponent', () => {
  let component: SubscriberSubscriptionsComponent;
  let fixture: ComponentFixture<SubscriberSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberSubscriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
