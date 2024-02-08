import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSuccessInfoComponent } from './plan-success-info.component';

describe('PlanSuccessInfoComponent', () => {
  let component: PlanSuccessInfoComponent;
  let fixture: ComponentFixture<PlanSuccessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanSuccessInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanSuccessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
