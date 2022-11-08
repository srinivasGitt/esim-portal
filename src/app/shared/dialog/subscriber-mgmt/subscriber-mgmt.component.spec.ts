import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberMgmtComponent } from './subscriber-mgmt.component';

describe('SubscriberMgmtComponent', () => {
  let component: SubscriberMgmtComponent;
  let fixture: ComponentFixture<SubscriberMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
