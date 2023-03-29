import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  dialogRef: DialogComponent;
  userDetails: any;

  constructor(private viewContainer: ViewContainerRef,
    ) {
      const _injector = this.viewContainer.injector;
      this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
    }

  ngOnInit(): void {
    this.userDetails = this.dialogRef.context.data;
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  editUser(): void {
    this.dialogRef.close.emit('edit');
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }

    navigator.clipboard.writeText(email);
  }
}
