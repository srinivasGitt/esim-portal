import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSuccessInfoComponent } from './report-success-info.component';

describe('ReportSuccessInfoComponent', () => {
  let component: ReportSuccessInfoComponent;
  let fixture: ComponentFixture<ReportSuccessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSuccessInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSuccessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
