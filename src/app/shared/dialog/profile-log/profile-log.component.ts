import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-profile-log',
  templateUrl: './profile-log.component.html',
  styleUrls: ['./profile-log.component.scss']
})
export class ProfileLogComponent implements OnInit {
  title: any = "Profile Log";
  profileLog: any = [
    {
      timeStamp: "2022-11-01T18:31:34.430Z",
      actionStatus: "RELEASED",
      EID: "",
      deviceModel: ""
    },
    {
      timeStamp: "2022-11-01T18:31:34.430Z",
      actionStatus: "RELEASED",
      EID: "",
      deviceModel: ""
    },
    {
      timeStamp: "2022-11-01T18:31:34.430Z",
      actionStatus: "RELEASED",
      EID: "",
      deviceModel: ""
    }
  ]
  constructor(private dialogRef: DialogComponent) { }

  ngOnInit(): void {
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
