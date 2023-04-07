import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog/dialog.component';

@Component({
  selector: 'app-download-sample-file',
  templateUrl: './download-sample-file.component.html',
  styleUrls: ['./download-sample-file.component.scss']
})
export class DownloadSampleFileComponent implements OnInit {

  dialogRef!: DialogComponent;
  data: any;
  title: string = 'Download Sample File';
  description: string = 'Download CSV or Excel Sample file to see how your file should look like.';
  submitted: boolean = false;
  files: any[] = [
                    {name: "sample.csv", path: "assets/sample-files/sample.csv"},
                    {name: "sample.xlsx", path: "assets/sample-files/sample.xlsx"}
                  ];

  constructor(private viewContainer: ViewContainerRef) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent)
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close.emit();
  }

}
