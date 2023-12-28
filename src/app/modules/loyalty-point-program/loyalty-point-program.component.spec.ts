import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyPointProgramComponent } from './loyalty-point-program.component';

describe('LoyaltyPointProgramComponent', () => {
  let component: LoyaltyPointProgramComponent;
  let fixture: ComponentFixture<LoyaltyPointProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyPointProgramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyPointProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
