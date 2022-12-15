import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProfileComponent } from './import-profile.component';

describe('ImportProfileComponent', () => {
  let component: ImportProfileComponent;
  let fixture: ComponentFixture<ImportProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
