import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-profile-log',
  templateUrl: './profile-log.component.html',
  styleUrls: ['./profile-log.component.scss']
})
export class ProfileLogComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  title: any = "Profile Log";
  profileLog: any = [
    {
      timeStamp: "2022-10-04T22:12:06.430Z",
      actionStatus: "ALLOCATED",
      EID: '89049032005008882600040700344582',
      deviceModel: "iPhone 12"
    },
    {
      timeStamp: "2022-10-03T21:31:34.430Z",
      actionStatus: "INSTALLED",
      EID: '89049032005008882600040700344582',
      deviceModel: "iPhone 13 pro"
    },
    {
      timeStamp: "2022-10-03T12:38:57.430Z",
      actionStatus: "AVAILABLE",
      EID: '89049032005008882600040700344582',
      deviceModel: "iPhone 14"
    },
  ]
  constructor(
    private viewContainer: ViewContainerRef,) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
   }

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    console.log(this.data);
    this.profileLog.unshift({
      timeStamp: this.data.updatedAt || this.data.createdAt,
      actionStatus: this.data.status,
      EID: '89049032004008882600016698204368',
      deviceModel: "iPhone 11 pro"
    },)
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
