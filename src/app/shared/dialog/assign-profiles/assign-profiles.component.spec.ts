import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProfilesComponent } from './assign-profiles.component';

describe('AssignProfilesComponent', () => {
  let component: AssignProfilesComponent;
  let fixture: ComponentFixture<AssignProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
