import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSubscriberComponent } from './invite-subscriber.component';

describe('InviteSubscriberComponent', () => {
  let component: InviteSubscriberComponent;
  let fixture: ComponentFixture<InviteSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteSubscriberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
