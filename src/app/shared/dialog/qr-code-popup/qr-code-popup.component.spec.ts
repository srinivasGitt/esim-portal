import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodePopupComponent } from './qr-code-popup.component';

describe('QrCodePopupComponent', () => {
  let component: QrCodePopupComponent;
  let fixture: ComponentFixture<QrCodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrCodePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
