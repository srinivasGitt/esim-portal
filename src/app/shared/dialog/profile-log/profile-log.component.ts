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
      actionStatus: "AVAILABLE",
      EID: "",
      deviceModel: "Samsung z flip"
    },
    {
      timeStamp: "2022-11-01T18:31:34.430Z",
      actionStatus: "ALLOCATED",
      EID: "",
      deviceModel: "Pixel 6"
    },
    {
      timeStamp: "2022-11-01T18:31:34.430Z",
      actionStatus: "RELEASED",
      EID: "",
      deviceModel: "Iphone 14"
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
