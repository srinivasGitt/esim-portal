import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCustomerViewComponent } from './single-customer-view.component';

describe('SingleCustomerViewComponent', () => {
  let component: SingleCustomerViewComponent;
  let fixture: ComponentFixture<SingleCustomerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCustomerViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCustomerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
