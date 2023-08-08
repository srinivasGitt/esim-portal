import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appStatusColor]'
})
export class StatusColorDirective {

  @Input('appStatusColor') textValue!: string;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textValue']) {
      this.updateTextColor();
    }
  }

  private updateTextColor() {
    let color: string;

    switch (this.textValue) {
      case 'Pending':
        color = '#FFA600';
        break;
      case 'Resolved':
        color = '#149A4B';
        break;
      case 'In Progress':
        color = '#7F8D26';
        break;
      case 'Unresolved':
        color = '#FF323E';
        break;
      default:
        color = 'black'; 
        break;
    }

    this.elementRef.nativeElement.style.color = color;
  }

}
