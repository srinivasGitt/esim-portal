import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberInfoComponent } from './subscriber-info.component';

describe('SubscriberInfoComponent', () => {
  let component: SubscriberInfoComponent;
  let fixture: ComponentFixture<SubscriberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
