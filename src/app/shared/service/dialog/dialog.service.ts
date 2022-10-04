import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
// import { Subject } from 'rxjs';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver) {}

  openModal(templateRef: any, userConfig: any) {
    // Create element
    const popup = document.createElement('popup-component');

    let className = 'main-container'
    if( document.getElementsByClassName("body-container") && document.getElementsByClassName("body-container")[0]) {
      // Running the cash register as separate app will have a different container
      className = 'body-container'
    }
    document.getElementsByClassName(className)[0].appendChild(popup);

    // Create the component and wire it up with the element
    const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const dialogComponentRef = factory.create(this.injector, [], popup);

    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(dialogComponentRef.hostView);

    // Listen to the close event
    dialogComponentRef.instance.close.subscribe(() => {
      document.body.removeChild(popup);
      this.applicationRef.detachView(dialogComponentRef.hostView);
    });

    // Set the message
    dialogComponentRef.instance.template = templateRef;
    dialogComponentRef.instance.context = userConfig.context;
    dialogComponentRef.instance.cssClass = userConfig.cssClass;

    // Add to the DOM
    document.body.appendChild(popup);
    return dialogComponentRef;
  }
}