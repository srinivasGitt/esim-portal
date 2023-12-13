import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  
  currentStepNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  
  // Observable to subscribe to changes in the current step
  currentStep$ = this.currentStepNumber$.asObservable();

  constructor() { }
  
  // Function to update the current step
  updateStep(step: number): void {
    this.currentStepNumber$.next(step);
  }

  // Function to reset the current step
  resetStep(): void {
    this.currentStepNumber$.next(1);
  }
}