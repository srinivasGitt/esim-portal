import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { FileUploadService } from '../../service/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-inventory',
  templateUrl: './upload-inventory.component.html',
  styleUrls: ['./upload-inventory.component.scss']
})
export class UploadInventoryComponent implements OnInit {

  dialogRef!: DialogComponent;
  data: any;
  title: string = 'Upload Inventory';
  description: string = 'Upload a CSV file data for your inventory.';
  uploadForm!: FormGroup;
  submitted: boolean = false;
  uploadedFile: File | null = null;
  isDragOver: boolean = false;
  progress!: number;

  constructor(private viewContainer: ViewContainerRef, 
              private _fileUploadService: FileUploadService,
              private alertService: AlertService) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent)
  }

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;  
    this._initForm();
  }

  private _initForm() {
    this.uploadForm = new FormGroup({
      file: new FormControl('')
    });
  }

  onFileUpload(event: any) {
    this.uploadedFile = event.target.files[0];
    // event.target = '';
  }

  // drag and drop function 
  storeFile(event: Event) {
    this.isDragOver = false;
    this.uploadedFile = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
  }

  // upload file
  submit() {  
    this.submitted = true;
    
    if(this.uploadForm.invalid) {
      return;
    }

    this._fileUploadService.onUpload(this.uploadedFile).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if(event.loaded && event.total) {
            this.progress = Math.round(event.loaded / event.total * 100);
          }
          break;
        case HttpEventType.Response:
          this.dialogRef.close.emit({event, text: 'uploadAnother'});
          this.uploadForm?.reset()
        }
      }, err => {
        this.submitted = false;
        this.alertService.error(err.error.message, err.status);
        this.uploadForm?.reset()
        this.uploadedFile = null;
        this.progress = 0
      })
  }

  dowloadSample() {
    this.dialogRef.close.emit('download')
  }

  close(): void {
    this.dialogRef.close.emit();
  }

}