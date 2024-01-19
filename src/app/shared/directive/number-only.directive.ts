import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective {
  // Regular expression to allow only numbers between 0 to 9
  private regex: RegExp = new RegExp(/^[0-9]+$/g);

  // Array of Keyboard keys which are allowed
  private specialKeys: Array<string> = [
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Delete',
    'Home',
    'End',
    'Tab',
  ];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Validation check on keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const initialValue: string = this.el.nativeElement.value;

    const newValue: string = initialValue.concat(event.key);
    if (newValue && !String(newValue).match(this.regex)) {
      event.preventDefault();
    }
  }
}
