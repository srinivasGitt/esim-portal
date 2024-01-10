import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  serverUrl = environment.serverUrl;
  currentStepNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  // Observable to subscribe to changes in the current step
  currentStep$ = this.currentStepNumber$.asObservable();

  constructor(private http: HttpClient) {}

  getDropdownData() {
    return [
      this.http.get(`${this.serverUrl}/subscription/plans`),
      this.http.get(`${this.serverUrl}/group`),
      this.http.get(`${this.serverUrl}/countries`),
    ];
  }

  // Function to update the current step
  updateStep(step: number): void {
    this.currentStepNumber$.next(step);
  }

  // Function to reset the current step
  resetStep(): void {
    this.currentStepNumber$.next(1);
  }

  // Function to POST coupon data
  saveCoupon(couponData: any) {
    return this.http.post(`${this.serverUrl}/couponCode`, couponData);
  }
}
