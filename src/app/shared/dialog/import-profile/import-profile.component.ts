import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { FileUploadService } from 'src/app/shared/service/file-upload.service'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-import-profile',
  templateUrl: './import-profile.component.html',
  styleUrls: ['./import-profile.component.scss']
})
export class ImportProfileComponent implements OnInit {
  dialogRef: DialogComponent;
  title: any = 'Select File';
  fileUploadForm: any;
  file!: File;
  data: any;
  shortLink: string = '';
  loading: boolean = false;
  constructor(
    private viewContainer: ViewContainerRef,
    private fileUploadService: FileUploadService,
    private alertService: AlertService) {
      const _injector = this.viewContainer.injector;
      this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.newfileUpload()
  }

  newfileUpload(){
    this.fileUploadForm = new UntypedFormGroup({
      file: new UntypedFormControl(this.data?.file, [Validators.required])
    })
  }

  get f(){
    return this.fileUploadForm.controls;
  }

  onChange(event: any){
    this.file = event.target.files[0];
    console.log(this.file)
  }

  onUpload(){
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.onUpload(this.file).subscribe((data : any) => {
      this.alertService.success("File has been uploaded successfully");
    },
    err=>{
      this.alertService.error(err.error.message);
    });
  }

  close(){
    this.dialogRef.close.emit();
  }
}
