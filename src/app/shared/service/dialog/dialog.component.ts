import { AfterViewInit, Component, ComponentFactoryResolver, Compiler, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private compiler: Compiler,
    private injector: Injector) { }
  @Output() close = new EventEmitter();
  @Input() template: any;
  @Input() context: any;
  @Input() cssClass: any;
  @Input() hasBackdrop: boolean | undefined = true;

  @ViewChild('backdrop', { read: ViewContainerRef }) backdrop!: ViewContainerRef;
  @ViewChild('dialogContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('dialog', { read: ViewContainerRef }) dialog!: ViewContainerRef;
  componentRef: any;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    import('src/app/shared/shared.module').then(({ SharedModule }) => {
      this.compiler.compileModuleAsync(SharedModule).then(moduleFactory => {
        const moduleRef: any = moduleFactory.create(this.injector);
        const componentFactory = moduleRef.instance.resolveComponent(this.template);
        this.componentRef = this.container.createComponent(componentFactory, undefined, moduleRef.injector);
        if (this.context && Object.keys(this.context).length > 0) {
          Object.keys(this.context).forEach(key => {
            this.componentRef.instance[key] = this.context[key];
          });
        }
        if (this.cssClass) {
          this.dialog.element.nativeElement.className += " " + this.cssClass;
        }
      })
    });

    if (!this.hasBackdrop) {
      this.backdrop.element.nativeElement.remove();
      if (this.backdrop.element?.nativeElement?.parentElement?.className) {
        this.backdrop.element.nativeElement.parentElement.className = `${this.backdrop.element.nativeElement.parentElement.className} top-spacing`;
      }
    } else if (!this.cssClass?.includes('top-spacing') && this.backdrop.element?.nativeElement?.parentElement?.className) {
      this.backdrop.element.nativeElement.parentElement.className = `${this.backdrop.element.nativeElement.parentElement.className} top-spacing`;
    }
  }

  ngOnDestroy(): void {
  }
}
