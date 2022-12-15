import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { DialogComponent } from '../../service/dialog';
import { InventoryService } from '../../service/inventory.service';

@Component({
  selector: 'app-assign-profiles',
  templateUrl: './assign-profiles.component.html',
  styleUrls: ['./assign-profiles.component.scss']
})
export class AssignProfilesComponent implements OnInit {
  dialogRef: DialogComponent;
  title:any = "Assign Profiles";
  assignProfileForm: any;
  data:any;
  submitted: any = false;
  constructor(
    private viewContainer: ViewContainerRef,
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) { 
    const _injector = this.viewContainer.injector;
      this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.newAssignProfileForm();
  }

  newAssignProfileForm(){
    this.assignProfileForm = new UntypedFormGroup({
      profileCount: new UntypedFormControl(this.data?.value, [Validators.required])
    })
  }

  get f() { return this.assignProfileForm.controls};

  submit(){
    this.submitted = true;
    const userData = {
      customerId: this.data._id,
      profileCount : this.assignProfileForm.get('profileCount').value

    }
    this.inventoryService.assignProfile(userData)
    .subscribe((res: any)=> {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }

  close(){
    this.dialogRef.close.emit();
  }

}
