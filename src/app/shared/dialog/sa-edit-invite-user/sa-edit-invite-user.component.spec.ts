import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaEditInviteUserComponent } from './sa-edit-invite-user.component';

describe('SaEditInviteUserComponent', () => {
  let component: SaEditInviteUserComponent;
  let fixture: ComponentFixture<SaEditInviteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaEditInviteUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaEditInviteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
