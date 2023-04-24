import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle!: string;
  @Input() placement!: string;
  @Input() delay!: string;
  @Input() offset: string = '0';
  tooltip!: HTMLElement | undefined;
  

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hide(); }
  }

  @HostListener('click') onClick() {
    if (this.tooltip?.innerText == 'Copy') { 
      this.tooltip.innerText = 'Copied';
    }
  }


  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    let self = this;
    window.setTimeout(() => {
      self.renderer.removeChild(document.body, self.tooltip);
      self.tooltip = undefined;
    }, parseInt(self.delay));
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.tooltip);
    // this.renderer.appendChild(this.el.nativeElement, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

    this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    const tooltipPos = this.tooltip?.getBoundingClientRect();

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

    if (this.placement === 'top' && tooltipPos) {
      top = hostPos.top - tooltipPos.height - parseInt(this.offset);
      // left = hostPos.left + (hostPos.width - (tooltipPos.width / 2.5)) / 2;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom' && tooltipPos) {
      top = hostPos.bottom + parseInt(this.offset);
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'left' && tooltipPos) {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - parseInt(this.offset);
    }

    if (this.placement === 'right' && tooltipPos) {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + parseInt(this.offset);
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
