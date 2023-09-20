import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-report-success-info',
  templateUrl: './report-success-info.component.html',
  styleUrls: ['./report-success-info.component.scss']
})
export class ReportSuccessInfoComponent implements OnInit {

  dialogRef!: DialogComponent;
  message = 'Report is successfully downloaded'
  data: {
    title: string | undefined,
    icon: string | undefined,
    showCloseBtn: boolean | undefined,
    buttonGroup: Array<{ cssClass: string, title: string, value: boolean}>,
    message:  string | undefined,
    email: string | undefined
  } = { title : undefined, icon: undefined, showCloseBtn : undefined, buttonGroup : [], message: undefined, email: undefined};

  title: string = 'Download Sample File';

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
