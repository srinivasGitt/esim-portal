import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupportInfoComponent } from './contact-support-info.component';

describe('ContactSupportInfoComponent', () => {
  let component: ContactSupportInfoComponent;
  let fixture: ComponentFixture<ContactSupportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSupportInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
