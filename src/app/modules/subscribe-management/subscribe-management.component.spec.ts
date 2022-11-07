import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeManagementComponent } from './subscribe-management.component';

describe('SubscribeManagementComponent', () => {
  let component: SubscribeManagementComponent;
  let fixture: ComponentFixture<SubscribeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
